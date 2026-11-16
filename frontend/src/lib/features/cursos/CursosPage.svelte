<script lang="ts">
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import Plus from "@lucide/svelte/icons/plus";
	import Pencil from "@lucide/svelte/icons/pencil";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { listCursos, createCurso, updateCurso, deleteCurso } from "./api.js";
	import { formSchema } from "./schema.js";
	import type { Curso } from "./types.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import * as Table from "#lib/components/ui/table/index.js";

	let cursos: Curso[] = $state([]);
	let loading = $state(true);
	let loadFailed = $state(false);
	let saving = $state(false);
	let deletingBusy = $state(false);
	let fieldError = $state("");
	let editing: Curso | null = $state(null);
	let deleting: Curso | null = $state(null);
	let dialog: HTMLDialogElement;
	let deleteDialog: HTMLDialogElement;
	let form: HTMLFormElement;

	async function loadCursos() {
		try {
			cursos = await listCursos();
			loadFailed = false;
		} catch (err) {
			loadFailed = true;
			toast.error(err instanceof Error ? err.message : "Erro ao carregar cursos.");
		} finally {
			loading = false;
		}
	}

	onMount(() => { void loadCursos(); });

	function openCreate() {
		editing = null;
		fieldError = "";
		form.reset();
		dialog.showModal();
	}

	function openEdit(curso: Curso) {
		editing = curso;
		fieldError = "";
		(form.elements.namedItem("nome") as HTMLInputElement).value = curso.nome;
		dialog.showModal();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const result = formSchema.safeParse(Object.fromEntries(new FormData(form)));
		fieldError = result.success ? "" : (result.error.flatten().fieldErrors.nome?.[0] ?? "");
		if (!result.success) return;

		saving = true;
		try {
			if (editing) await updateCurso(editing._id, result.data);
			else await createCurso(result.data);
			dialog.close();
			form.reset();
			toast.success(editing ? "Curso atualizado com sucesso." : "Curso adicionado com sucesso.");
			editing = null;
			await loadCursos();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao guardar curso.");
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		if (!deleting) return;
		deletingBusy = true;
		try {
			await deleteCurso(deleting._id);
			deleteDialog.close();
			deleting = null;
			toast.success("Curso eliminado com sucesso.");
			await loadCursos();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao eliminar curso.");
		} finally {
			deletingBusy = false;
		}
	}
</script>

<svelte:head>
	<title>Cursos</title>
</svelte:head>

<section class="p-6 md:p-10">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Cursos</h1>
			<p class="mt-2 text-sm text-muted-foreground">Consulta e gestão de cursos.</p>
		</div>
		<Button onclick={openCreate}>
			<Plus size={16} /> Adicionar curso
		</Button>
	</div>

	<div class="mt-8 overflow-hidden rounded-xl border border-border bg-card">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>ID</Table.Head>
					<Table.Head>Nome</Table.Head>
					<Table.Head>Ações</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each cursos as curso (curso._id)}
					<Table.Row>
						<Table.Cell><span class="text-xs text-muted-foreground">{curso._id}</span></Table.Cell>
						<Table.Cell><span class="font-medium">{curso.nome}</span></Table.Cell>
						<Table.Cell>
							<div class="flex items-center gap-1">
								<Button variant="ghost" size="icon-sm" aria-label={`Editar ${curso.nome}`} onclick={() => openEdit(curso)}><Pencil size={16} /></Button>
								<Button variant="ghost" size="icon-sm" class="text-destructive hover:text-destructive" aria-label={`Eliminar ${curso.nome}`} onclick={() => { deleting = curso; deleteDialog.showModal(); }}><Trash2 size={16} /></Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row><Table.Cell colspan={3}>{loading ? "A carregar cursos..." : loadFailed ? "Não foi possível carregar os cursos." : "Ainda não existem cursos."}</Table.Cell></Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</section>

<dialog bind:this={dialog} class="m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-black/70">
	<h2 class="text-lg font-semibold">{editing ? "Editar curso" : "Adicionar curso"}</h2>
	<p class="mt-1 text-sm text-muted-foreground">{editing ? "Altera o nome do curso." : "Preenche o nome do novo curso."}</p>
	<form bind:this={form} onsubmit={handleSubmit} novalidate class="mt-6 space-y-4">
		<div class="space-y-2">
			<Label for="curso-nome">Nome do curso</Label>
			<Input id="curso-nome" name="nome" maxlength={150} aria-invalid={!!fieldError} aria-describedby={fieldError ? "curso-nome-erro" : undefined} />
			{#if fieldError}<p id="curso-nome-erro" class="text-sm text-destructive">{fieldError}</p>{/if}
		</div>
		<div class="flex justify-end gap-2 pt-2">
			<Button variant="outline" disabled={saving} onclick={() => dialog.close()}>Cancelar</Button>
			<Button type="submit" disabled={saving}>{saving ? "A guardar..." : editing ? "Guardar alterações" : "Guardar curso"}</Button>
		</div>
	</form>
</dialog>

<dialog bind:this={deleteDialog} class="m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-black/70">
	<h2 class="text-lg font-semibold">Eliminar curso?</h2>
	<p class="mt-2 text-sm text-muted-foreground">Tens a certeza de que queres eliminar {deleting?.nome}? Esta ação não pode ser anulada.</p>
	<div class="mt-6 flex justify-end gap-2">
		<Button variant="outline" disabled={deletingBusy} onclick={() => deleteDialog.close()}>Cancelar</Button>
		<Button variant="destructive" disabled={deletingBusy} onclick={handleDelete}>{deletingBusy ? "A eliminar..." : "Eliminar curso"}</Button>
	</div>
</dialog>
