import type { Meta, StoryObj} from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { asyncVueRouter } from 'storybook-vue3-router';

import { type ICategoryProvider } from '@/database/models/category';

import { expect, jest } from '@storybook/jest';

import '../assets/base.css'
import '../assets/main.css'

const existingCategory = { id: 1, name: 'Existing Category' };

setup((app) => {
  app.provide('categories', {
    getCategory: async () => existingCategory  
  });
});

import CategoriesEditView from './CategoriesEditView.vue'
const meta = {
  component: CategoriesEditView,
} satisfies Meta<typeof CategoriesEditView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { CategoriesEditView },
    setup() {
      return { args }
    },
    template: `
      <CategoriesEditView v-bind="args" />
    `,
  }),
  decorators: [
    asyncVueRouter(
      [
        { path: '/categories/:id', name: 'categories-edit', component: CategoriesEditView },
        { path: '/categories', name: 'categories', component: CategoriesEditView },
      ],
      { initialRoute: '/categories/1' }
    )
  ],
  args: {}
}
