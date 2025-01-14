<script setup lang="ts">
import type { InternalApi } from 'nitropack'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import { cn } from '@/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

const { toast } = useToast()

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Rating | Enspire',
})

const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
  club: z.string(),
  score: z.number().lte(5),
  comment: z.string().max(100).optional(),
}))

const { data } = await useQuery<InternalApi['/api/club/rating/available']['get']>({
  queryKey: ['/api/club/rating/available'],
})

if (!data.value) {
  throw createError({
    statusCode: 500,
    message: '服务器错误',
  })
}

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

function onSubmitRating() {
  return handleSubmit(async (values) => {
    isLoading.value = true
    const ratingData = {
      club: values.club,
      date: new Date().toISOString(),
      score: values.score,
      comment: values.comment || 'null',
    }
    const { error } = await useFetch('/api/club/rating/new', {
      headers: useRequestHeaders(),
      method: 'post',
      server: false,
      body: ratingData,
    })
    if (error.value) {
      toast({
        title: '错误',
        description: '请稍后再试',
        variant: 'destructive',
      })
    }
    isLoading.value = false
    resetForm()
  })
}
</script>

<template>
  <div class="w-full">
    <Card class="w-full">
      <CardContent class="mt-6">
        <form class="space-y-6" @submit="onSubmitRating">
          <FormField v-slot="{ componentField, value }" name="club">
            <FormItem>
              <FormLabel>社团*</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger :class="cn('w-full ps-3 text-start font-normal hover:bg-muted', !value && 'text-muted-foreground')" variant="outline" :disabled="isLoading">
                    <SelectValue placeholder="选择您需要评分的社团..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup v-if="data">
                    <SelectItem v-for="club in data" :key="club.id" :value="String(club.id)">
                      {{ typeof club?.name === 'object' && 'zh' in club.name! ? club.name.zh : '' }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, value }" name="score">
            <FormItem class="flex flex-col">
              <FormLabel>社团评分*</FormLabel>
              <Select v-bind="componentField">
                <SelectTrigger :class="cn('w-full ps-3 text-start font-normal hover:bg-muted', !value && 'text-muted-foreground')" variant="outline" :disabled="isLoading">
                  <SelectValue placeholder="选取该社团的评分" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Scores</SelectLabel>
                    <SelectItem v-for="n in 5" :key="String(n)" :value="String(n)">
                      {{ n }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="comment">
            <FormItem>
              <FormLabel>请假原因</FormLabel>
              <FormControl>
                <Textarea class="resize-none" placeholder="评分原因，最多一百字..." v-bind="componentField" :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button :disabled="isLoading" type="submit">
            提交评分
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
