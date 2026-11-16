<script lang="ts">
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { BarChart, PieChart } from "layerchart";
	import * as Card from "#lib/components/ui/card/index.js";
	import * as Chart from "#lib/components/ui/chart/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { getDashboardData, type DashboardData } from "./api.js";

	const colors = [
		"var(--chart-1)",
		"var(--chart-2)",
		"var(--chart-3)",
		"var(--chart-4)",
		"var(--chart-5)"
	];

	const chartConfig = {
		alunos: { label: "Alunos", color: "var(--chart-1)" }
	} satisfies Chart.ChartConfig;

	let data: DashboardData | null = $state(null);
	let loading = $state(true);
	let error = $state(false);

	async function loadDashboard() {
		loading = true;
		try {
			data = await getDashboardData();
			error = false;
		} catch (err) {
			error = true;
			toast.error(err instanceof Error ? err.message : "Erro ao carregar o dashboard.");
		} finally {
			loading = false;
		}
	}

	onMount(() => { void loadDashboard(); });

	const years = $derived.by(() => {
		if (!data) return [];
		const counts = new Map<number, number>();
		for (const aluno of data.alunos) counts.set(aluno.ano, (counts.get(aluno.ano) ?? 0) + 1);
		return [...counts.entries()]
			.sort(([a], [b]) => a - b)
			.map(([ano, value], index) => ({
				key: String(ano),
				label: `${ano}.º ano`,
				value,
				color: colors[index % colors.length],
				props: { fill: colors[index % colors.length] }
			}));
	});

	const coursesStatus = $derived.by(() => {
		if (!data) return [];
		const active = data.alunoSummary.cursosAtivos;
		return [
			{ key: "ativos", label: "Com alunos", value: active, color: colors[0], props: { fill: colors[0] } },
			{ key: "livres", label: "Sem alunos", value: Math.max(0, data.cursoSummary.cursosDisponiveis - active), color: colors[1], props: { fill: colors[1] } }
		];
	});

	const studentsByCourse = $derived.by(() => {
		if (!data) return [];
		const counts = new Map<string, number>();
		for (const aluno of data.alunos) {
			const id = aluno.curso?._id;
			if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
		}
		return data.cursos.map((curso) => ({
			curso: curso.nome,
			alunos: counts.get(curso._id) ?? 0
		}));
	});
</script>

<svelte:head>
	<title>Dashboard | Gestão Académica</title>
</svelte:head>

<section class="mx-auto w-full max-w-[1600px] space-y-8 p-6 md:p-10">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
		<p class="mt-2 text-sm text-muted-foreground">Visão geral da gestão académica.</p>
	</div>

	{#if loading}
		<p class="text-sm text-muted-foreground" role="status">A carregar dados...</p>
	{:else if error || !data}
		<div class="rounded-xl border border-border bg-card p-6">
			<p class="mb-4 text-sm text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
			<Button variant="outline" onclick={loadDashboard}>Tentar novamente</Button>
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Alunos por ano</Card.Title>
					<Card.Description>Distribuição dos {data.alunoSummary.qntAlunos} alunos registados</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-wrap items-center gap-8">
					{#if years.length}
						<Chart.Container config={chartConfig} class="relative size-48 shrink-0 aspect-square xl:size-52">
							<PieChart data={years} key="key" label="label" value="value" innerRadius={0.68} outerRadius={0.93} tooltipContext={false} />
							<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
								<strong class="text-3xl font-semibold tabular-nums">{data.alunoSummary.qntAlunos}</strong>
								<span class="text-xs text-muted-foreground">alunos</span>
							</div>
						</Chart.Container>
						<ul class="min-w-36 flex-1 space-y-2 text-sm" aria-label="Alunos por ano">
							{#each years as year (year.key)}
								<li class="flex items-center justify-between gap-3">
									<span class="flex items-center gap-2"><span class="size-2.5 rounded-full" style:background-color={year.color}></span>{year.label}</span>
									<strong class="tabular-nums">{year.value}</strong>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="py-12 text-sm text-muted-foreground">Ainda não existem alunos.</p>
					{/if}
				</Card.Content>
				<Card.Footer class="text-xs text-muted-foreground">
					Idade média: {data.alunoSummary.idadeMedia === null ? "—" : `${data.alunoSummary.idadeMedia.toFixed(1)} anos`}
				</Card.Footer>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Ocupação dos cursos</Card.Title>
					<Card.Description>{data.cursoSummary.cursosDisponiveis} cursos disponíveis</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-wrap items-center gap-8">
					{#if data.cursoSummary.cursosDisponiveis}
						<Chart.Container config={chartConfig} class="relative size-48 shrink-0 aspect-square xl:size-52">
							<PieChart data={coursesStatus} key="key" label="label" value="value" innerRadius={0.68} outerRadius={0.93} tooltipContext={false} />
							<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
								<strong class="text-3xl font-semibold tabular-nums">{data.alunoSummary.cursosAtivos}</strong>
								<span class="text-xs text-muted-foreground">com alunos</span>
							</div>
						</Chart.Container>
						<ul class="min-w-36 flex-1 space-y-2 text-sm" aria-label="Ocupação dos cursos">
							{#each coursesStatus as item (item.key)}
								<li class="flex items-center justify-between gap-3">
									<span class="flex items-center gap-2"><span class="size-2.5 rounded-full" style:background-color={item.color}></span>{item.label}</span>
									<strong class="tabular-nums">{item.value}</strong>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="py-12 text-sm text-muted-foreground">Ainda não existem cursos.</p>
					{/if}
				</Card.Content>
				<Card.Footer class="text-xs text-muted-foreground">
					Média de {data.cursoSummary.mediaPorCurso.toFixed(1)} alunos por curso
				</Card.Footer>
			</Card.Root>

			<Card.Root class="lg:col-span-2">
				<Card.Header>
					<Card.Title>Alunos por curso</Card.Title>
					<Card.Description>Quantidade de alunos inscritos em cada curso</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if studentsByCourse.length}
						<div class="overflow-x-auto pb-2">
							<Chart.Container config={chartConfig} class="w-full min-w-[560px] aspect-auto" style={`height: ${Math.max(340, studentsByCourse.length * 60)}px`}>
								<BarChart
									data={studentsByCourse}
									x="alunos"
									y="curso"
									orientation="horizontal"
									padding={{ top: 12, right: 24, bottom: 24, left: 170 }}
									series={[{ key: "alunos", label: "Alunos", color: "var(--chart-1)" }]}
								>
									{#snippet tooltip()}<Chart.Tooltip />{/snippet}
								</BarChart>
							</Chart.Container>
						</div>
					{:else}
						<p class="py-12 text-sm text-muted-foreground">Adiciona um curso para veres a distribuição de alunos.</p>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</section>
