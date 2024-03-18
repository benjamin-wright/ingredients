import type { Meta, StoryObj } from '@storybook/vue3';
import ObjectList from './ObjectList.vue';

import '../assets/base.css';
import '../assets/main.css';

const meta = {
  component: ObjectList as unknown as Record<string, unknown>,
  argTypes: {
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onSwap: { action: 'swap' },
  }
} satisfies Meta<typeof ObjectList<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { ObjectList },
    setup() {
      return { args };
    },
    template: `
      <ObjectList v-bind="args" >
        <template #content="{ obj }">
          <div role="content">{{ obj.name }}</div>
        </template>
      </ObjectList>
    `
  }),
  args: {
    data: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Joe' },
      { id: 4, name: 'Jack' },
    ],
    dropdown: false,
    reorder: false,
    confirmationMessage: 'sure?',
    getId: (id: number) => id,
  }
};

export const WithDropdown: Story = {
  render: (args) => ({
    components: { ObjectList },
    setup() {
      return { args };
    },
    template: `
      <ObjectList v-bind="args">
        <template #content="{ obj }">
          <div role="content">{{ obj.name }}</div>
        </template>
        <template #select-dropdown="{ obj }">
          <div role="dropdown" style="padding: 0.5em">dropdown: {{ obj.id }}</div>
        </template>
      </ObjectList>
    `
  }),
  args: {
    ...Default.args,
    dropdown: true,
  }
};

export const WithReorder: Story = {
  render: (args) => ({
    components: { ObjectList },
    setup() {
      return { args };
    },
    template: `
      <ObjectList v-bind="args" >
        <template #content="{ obj }">
          <div role="content">{{ obj.name }}</div>
        </template>
      </ObjectList>
    `
  }),
  args: {
    ...Default.args,
    reorder: true,
  }
};
