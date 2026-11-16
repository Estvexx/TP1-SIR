<script lang="ts">
	import * as Sidebar from "#lib/components/ui/sidebar/index.js";
	import { page } from "$app/state";
	import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
	import UsersRound from "@lucide/svelte/icons/users-round";
	import BookOpen from "@lucide/svelte/icons/book-open";
	import GraduationCap from "@lucide/svelte/icons/graduation-cap";

	const username = "Francisco Esteves";
	const initials = "FE"
</script>

<Sidebar.Root class="border-r border-sidebar-border">
	<Sidebar.Header class="px-4 pt-7 pb-6">
		<a href="/" class="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
			<span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground">
				<GraduationCap size={21} strokeWidth={1.8} />
			</span>
			<span class="min-w-0">
				<span class="block truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">Gestão Académica</span>
				<span class="block truncate text-xs text-muted-foreground">Painel de controlo</span>
			</span>
		</a>
	</Sidebar.Header>
	<Sidebar.Content class="px-3">
		<Sidebar.Group class="border-t border-sidebar-border px-0 pt-5">
			<Sidebar.GroupLabel class="px-3 text-xs font-medium text-muted-foreground">Navegação</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="mt-2 gap-1">
					<Sidebar.MenuItem>
						<a href="/" aria-current={page.url.pathname === "/" ? "page" : undefined} class="flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-foreground">
							<LayoutDashboard size={18} strokeWidth={1.8} />
							<span>Dashboard</span>
						</a>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<a href="/alunos" aria-current={page.url.pathname.startsWith("/alunos") ? "page" : undefined} class="flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-foreground">
							<UsersRound size={18} strokeWidth={1.8} />
							<span>Alunos</span>
						</a>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<a href="/cursos" aria-current={page.url.pathname.startsWith("/cursos") ? "page" : undefined} class="flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-foreground">
							<BookOpen size={18} strokeWidth={1.8} />
							<span>Cursos</span>
						</a>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="px-4 pb-5">
		<div class="flex items-center gap-3 border-t border-sidebar-border px-1 pt-5">
			<span
				aria-hidden="true"
				class="flex size-9 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-foreground"
			>
				{initials}
			</span>
			<span class="min-w-0 truncate text-sm font-medium text-sidebar-foreground">{username}</span>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
