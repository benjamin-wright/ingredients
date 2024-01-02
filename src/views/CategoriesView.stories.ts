import type { Meta, StoryObj } from '@storybook/vue3';
import { vueRouter } from 'storybook-vue3-router';

import { type ICategoryProvider } from '@/database/models/category';

import { expect, jest } from '@storybook/jest';

import '../assets/base.css'
import '../assets/main.css'

import CategoriesView from './CategoriesView.vue'
const meta = {
  component: CategoriesView,
  decorators: [vueRouter([
    { path: '/', component: CategoriesView },
    { path: '/categories/0', component: CategoriesView },
  ], { initialRoute: '/' })],
} satisfies Meta<typeof CategoriesView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { CategoriesView },
    setup() {
      return { args }
    },
    template: `
        <CategoriesView v-bind="args" />
      `
  }),
  args: {}
}
