<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const links = [
  {
    id: 'home',
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/dashboard',
    tooltip: {
      text: 'Home',
      shortcuts: ['G', 'H']
    }
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'i-heroicons-document-chart-bar',
    to: '/dashboard/reports',
    tooltip: {
      text: 'Reports',
      shortcuts: ['G', 'R']
    }
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/dashboard/settings',
    icon: 'i-heroicons-cog-8-tooth',
    children: [
      { label: 'General', to: '/dashboard/settings', exact: true },
      { label: 'Members', to: '/settings/members' },
    ],
    tooltip: {
      text: 'Settings',
      shortcuts: ['G', 'S']
    }
  }
]

const footerLinks = [
  {
    label: 'Invite people',
    icon: 'i-heroicons-plus',
    to: '/settings/members'
  },
  {
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    click: () => (isHelpSlideoverOpen.value = true)
  }
]

const groups = [
  {
    key: 'links',
    label: 'Go to',
    commands: links.map(link => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts
    }))
  },
  {
    key: 'code',
    label: 'Code',
    commands: [
      {
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${
              route.path === '/' ? '/index' : route.path
            }.vue`,
            '_blank'
          )
        }
      }
    ]
  }
]

const defaultColors = ref(
  ['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color)
  }))
)
const colors = computed(() =>
  defaultColors.value.map(color => ({
    ...color,
    active: appConfig.ui.primary === color.label
  }))
)

const isActiveLink = (path: string) => route.path.startsWith(path)
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <!-- Navbar -->
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <UTeamsDropdown />
        </template>
      </UDashboardNavbar>

      <!-- Sidebar -->
      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <!-- Navigation Links -->
        <UDashboardSidebarLinks
          :links="links.map((link) => ({ ...link, active: isActiveLink(link.to) }))"
        />




        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Footer Links -->
        <UDashboardSidebarLinks :links="footerLinks" />

        <!-- Footer -->
        <UDivider class="sticky bottom-0" />
        <template #footer>
          <UUserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <!-- Slot for Main Content -->
    <slot />

    <!-- Help and Notifications -->
    <UHelpSlideover />
    <UNotificationsSlideover />

    <!-- Search -->
    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
