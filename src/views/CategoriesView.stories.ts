import { setup, type Meta, type StoryObj } from '@storybook/vue3';
import { vueRouter } from 'storybook-vue3-router';

import '../assets/base.css'
import '../assets/main.css'

setup(app => {
  app.provide('categories', {
    getCategories: async () => [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
      { id: 3, name: 'Category 3' },
    ]
  });
})

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
