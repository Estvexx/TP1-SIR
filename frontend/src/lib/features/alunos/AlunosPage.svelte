<script lang="ts">
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import Plus from "@lucide/svelte/icons/plus";
	import Pencil from "@lucide/svelte/icons/pencil";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { listAlunos, createAluno, updateAluno, deleteAluno } from "./api.js";
	import { listCursos } from "../cursos/api.js";
	import { formSchema } from "./schema.js";
	import type { Aluno } from "./types.js";
	import type { Curso } from "../cursos/types.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import * as Table from "#lib/components/ui/table/index.js";

	let alunos: Aluno[] = $state([]);
	let cursos: Curso[] = $state([]);
	let loading = $state(true);
	let loadFailed = $state(false);
	let saving = $state(false);
	let deletingBusy = $state(false);
	let errors: Record<string, string> = $state({});
	let editing: Aluno | null = $state(null);
	let deleting: Aluno | null = $state(null);
	let dialog: HTMLDialogElement;
	let deleteDialog: HTMLDialogElement;
	let form: HTMLFormElement;

	async function loadAlunos() {
		try {
			alunos = await listAlunos();
			loadFailed = false;
		} catch (err) {
			loadFailed = true;
			toast.error(err instanceof Error ? err.message : "Erro ao carregar alunos.");
		} finally {
			loading = false;
		}
	}

	async function loadCursos() {
		try {
			cursos = await listCursos();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao carregar cursos.");
		}
	}

	onMount(() => { void loadAlunos(); void loadCursos(); });

	function openCreate() {
		editing = null;
		errors = {};
		form.reset();
		if (!cursos.length) toast.info("Adiciona primeiro um curso na página Cursos.");
		dialog.showModal();
	}

	function openEdit(aluno: Aluno) {
		editing = aluno;
		errors = {};
		(form.elements.namedItem("nome") as HTMLInputElement).value = aluno.nome;
		(form.elements.namedItem("apelido") as HTMLInputElement).value = aluno.apelido;
		(form.elements.namedItem("idade") as HTMLInputElement).value = String(aluno.idade);
		(form.elements.namedItem("ano") as HTMLInputElement).value = String(aluno.ano);
		(form.elements.namedItem("curso") as HTMLSelectElement).value = aluno.curso?._id ?? "";
		dialog.showModal();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const result = formSchema.safeParse(Object.fromEntries(new FormData(form)));
		errors = {};
		if (!result.success) {
			for (const issue of result.error.issues) errors[String(issue.path[0])] = issue.message;
			return;
		}

		saving = true;
		try {
			if (editing) await updateAluno(editing._id, result.data);
			else await createAluno(result.data);
			dialog.close();
			form.reset();
			toast.success(editing ? "Aluno atualizado com sucesso." : "Aluno adicionado com sucesso.");
			editing = null;
			await loadAlunos();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao guardar aluno.");
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		if (!deleting) return;
		deletingBusy = true;
		try {
			await deleteAluno(deleting._id);
			deleteDialog.close();
			deleting = null;
			toast.success("Aluno eliminado com sucesso.");
			await loadAlunos();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao eliminar aluno.");
		} finally {
			deletingBusy = false;
		}
	}
</script>

<svelte:head>
	<title>Alunos</title>
</svelte:head>

<section class="p-6 md:p-10">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Alunos</h1>
			<p class="mt-2 text-sm text-muted-foreground">Consulta e gestão de alunos.</p>
		</div>
		<Button onclick={openCreate}>
			<Plus size={16} /> Adicionar aluno
		</Button>
	</div>

	<div class="mt-8 overflow-hidden rounded-xl border border-border bg-card">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Nome</Table.Head>
					<Table.Head>Idade</Table.Head>
					<Table.Head>Curso</Table.Head>
					<Table.Head>Ano</Table.Head>
					<Table.Head>Ações</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each alunos as aluno (aluno._id)}
					<Table.Row>
						<Table.Cell><span class="font-medium">{aluno.nome} {aluno.apelido}</span></Table.Cell>
						<Table.Cell>{aluno.idade}</Table.Cell>
						<Table.Cell>{aluno.curso?.nome ?? "Sem curso"}</Table.Cell>
						<Table.Cell>{aluno.ano}</Table.Cell>
						<Table.Cell>
							<div class="flex items-center gap-1">
								<Button variant="ghost" size="icon-sm" aria-label={`Editar ${aluno.nome} ${aluno.apelido}`} onclick={() => openEdit(aluno)}><Pencil size={16} /></Button>
								<Button variant="ghost" size="icon-sm" class="text-destructive hover:text-destructive" aria-label={`Eliminar ${aluno.nome} ${aluno.apelido}`} onclick={() => { deleting = aluno; deleteDialog.showModal(); }}><Trash2 size={16} /></Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row><Table.Cell colspan={5}>{loading ? "A carregar alunos..." : loadFailed ? "Não foi possível carregar os alunos." : "Ainda não existem alunos."}</Table.Cell></Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</section>

<dialog bind:this={dialog} class="m-auto w-[min(100%-2rem,30rem)] rounded-xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-black/70">
	<h2 class="text-lg font-semibold">{editing ? "Editar aluno" : "Adicionar aluno"}</h2>
	<p class="mt-1 text-sm text-muted-foreground">{editing ? "Altera os dados do aluno." : "Preenche os dados do novo aluno."}</p>
	<form bind:this={form} onsubmit={handleSubmit} novalidate class="mt-6 space-y-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-2">
				<Label for="aluno-nome">Nome</Label>
				<Input id="aluno-nome" name="nome" maxlength={23} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "erro-nome" : undefined} />
				{#if errors.nome}<p id="erro-nome" class="text-sm text-destructive">{errors.nome}</p>{/if}
			</div>
			<div class="space-y-2">
				<Label for="aluno-apelido">Apelido</Label>
				<Input id="aluno-apelido" name="apelido" maxlength={23} aria-invalid={!!errors.apelido} aria-describedby={errors.apelido ? "erro-apelido" : undefined} />
				{#if errors.apelido}<p id="erro-apelido" class="text-sm text-destructive">{errors.apelido}</p>{/if}
			</div>
			<div class="space-y-2">
				<Label for="aluno-idade">Idade</Label>
				<Input id="aluno-idade" name="idade" type="number" min="1" max="130" step="1" aria-invalid={!!errors.idade} aria-describedby={errors.idade ? "erro-idade" : undefined} />
				{#if errors.idade}<p id="erro-idade" class="text-sm text-destructive">{errors.idade}</p>{/if}
			</div>
			<div class="space-y-2">
				<Label for="aluno-ano">Ano</Label>
				<Input id="aluno-ano" name="ano" type="number" min="1" step="1" aria-invalid={!!errors.ano} aria-describedby={errors.ano ? "erro-ano" : undefined} />
				{#if errors.ano}<p id="erro-ano" class="text-sm text-destructive">{errors.ano}</p>{/if}
			</div>
		</div>
		<div class="space-y-2">
			<Label for="aluno-curso">Curso</Label>
			<select id="aluno-curso" name="curso" aria-invalid={!!errors.curso} aria-describedby={errors.curso ? "erro-curso" : undefined} class="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-ring">
				<option value="">Seleciona um curso</option>
				{#each cursos as curso (curso._id)}<option value={curso._id}>{curso.nome}</option>{/each}
			</select>
			{#if errors.curso}<p id="erro-curso" class="text-sm text-destructive">{errors.curso}</p>{/if}
			{#if !cursos.length}<p class="text-xs text-muted-foreground">Adiciona primeiro um curso na página Cursos.</p>{/if}
		</div>
		<div class="flex justify-end gap-2 pt-2">
			<Button variant="outline" disabled={saving} onclick={() => dialog.close()}>Cancelar</Button>
			<Button type="submit" disabled={saving || !cursos.length}>{saving ? "A guardar..." : editing ? "Guardar alterações" : "Guardar aluno"}</Button>
		</div>
	</form>
</dialog>

<dialog bind:this={deleteDialog} class="m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-black/70">
	<h2 class="text-lg font-semibold">Eliminar aluno?</h2>
	<p class="mt-2 text-sm text-muted-foreground">Tens a certeza de que queres eliminar {deleting?.nome} {deleting?.apelido}? Esta ação não pode ser anulada.</p>
	<div class="mt-6 flex justify-end gap-2">
		<Button variant="outline" disabled={deletingBusy} onclick={() => deleteDialog.close()}>Cancelar</Button>
		<Button variant="destructive" disabled={deletingBusy} onclick={handleDelete}>{deletingBusy ? "A eliminar..." : "Eliminar aluno"}</Button>
	</div>
</dialog>
