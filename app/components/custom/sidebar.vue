<script setup lang="ts">
import type { AllClubs } from '@@/types/api/user/all_clubs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const route = useRoute()

const isPresidentOrVicePresident = ref(false)
useState('isEnspireLoading').value = true

const { data: clubs, suspense } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})
await suspense()

if (clubs.value) {
  useState('isEnspireLoading').value = false
  if (clubs.value.president.length !== 0 || clubs.value.vice.length !== 0) {
    isPresidentOrVicePresident.value = true
  }
}
</script>

<template>
  <div :class="cn('h-full', $attrs.class ?? '')">
    <div class="h-full border-r-2 py-4 backdrop-blur-3xl space-y-3">
      <div class="px-3 py-2">
        <div class="mt-2 space-y-1">
          <NuxtLink to="/">
            <Button :variant="route.name === 'index' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:home-outline-rounded" />
              首页
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          学校事务
        </h2>
        <div class="mt-2">
          <NuxtLink to="/forms">
            <Button :variant="route.name === 'forms' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:grid-view-outline-rounded" />
              表单
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          社团信息
        </h2>
        <div class="mt-2">
          <NuxtLink to="/cas/clubs">
            <Button :variant="route.name === 'cas-clubs' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:grid-view-outline-rounded" />
              社团列表
            </Button>
          </NuxtLink>
          <NuxtLink v-if="[0, 1, 5, 6].includes(new Date().getMonth())" to="/cas/rating">
            <Button :variant="route.name === 'cas-rating' ? 'secondary' : 'ghost'" class="mt-1 w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:rate-review-outline" />
              期末评价
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          CAS管理
        </h2>
        <div class="mt-2">
          <NuxtLink v-if="isPresidentOrVicePresident" to="/manage/reservation">
            <Button :variant="route.name === 'manage-reservation' ? 'secondary' : 'ghost'" class="mt-1 w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              预约教室
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/manage">
            <Button v-if="isPresidentOrVicePresident" :variant="route.name === 'manage-manage' ? 'secondary' : 'ghost'" class="mt-1 w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              管理预约
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/statuses">
            <Button :variant="route.name === 'manage-statuses' ? 'secondary' : 'ghost'" class="mt-1 w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              教室状态
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/record">
            <Button :variant="route.name === 'manage-record' ? 'secondary' : 'ghost'" class="mt-1 w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="charm:tick-double" />
              活动签到
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          信息
        </h2>
        <div class="mt-2 space-y-1">
          <NuxtLink to="/about">
            <Button :variant="route.name === 'about' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:info-outline" />
              关于 Enspire
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
