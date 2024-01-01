import type { Meta, StoryObj } from '@storybook/vue3';
import ObjectList from './ObjectList.vue';

import '../assets/base.css';
import '../assets/main.css';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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
  play: async (options: any) => {
    const canvas = within(options.canvasElement);
    const rows = await canvas.findAllByRole('content');
    await expect(rows.map(el => el.textContent)).toStrictEqual([
      'John',
      'Jane',
    ]);

    await options.step('Check delete action', async () => {
      await userEvent.click(rows[0]);
      const deleteButton = await canvas.findByRole('button', { name: 'delete' });
      await userEvent.click(deleteButton)
      const confirmButton = await canvas.findByRole('button', { name: 'OK' });
      await userEvent.click(confirmButton);
      await expect(options.args.onDelete).toHaveBeenCalledWith({ id: 1, name: 'John' });
    });

    await options.step('Check edit action', async () => {
      await userEvent.click(rows[0]);
      const editButton = await canvas.findByRole('button', { name: 'edit' });
      await userEvent.click(editButton);
      await expect(options.args.onEdit).toHaveBeenCalledWith({ id: 1, name: 'John' });
    });
  },
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
    ],
    dropdown: false,
    reorder: false,
    confirmationMessage: 'sure?',
    getId: (id: number) => id,
  }
};

export const WithDropdown: Story = {
  play: async (options: any) => {
    const canvas = within(options.canvasElement);

    const rows = await canvas.findAllByRole('display');
    await expect(rows.map(el => el.textContent)).toStrictEqual([
      'John',
      'Jane',
    ]);

    await options.step('Click on first row', async () => {
      await userEvent.click(rows[0]);
      const firstClick = await canvas.findAllByRole('dropdown');
      await expect(firstClick.map(el => el.textContent)).toStrictEqual([
        'dropdown: 1',
      ]);
    });

    await options.step('Click on second row', async () => {
      await userEvent.click(rows[1]);
      const secondClick = await canvas.findAllByRole('dropdown');
      await expect(secondClick.map(el => el.textContent)).toStrictEqual([
        'dropdown: 2',
      ]);
    });
  },
  render: (args) => ({
    components: { ObjectList },
    setup() {
      return { args };
    },
    template: `
      <ObjectList v-bind="args">
        <template #content="{ obj }">
          <div role="display">{{ obj.name }}</div>
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
          <div>{{ obj.name }}</div>
        </template>
      </ObjectList>
    `
  }),
  args: {
    ...Default.args,
    reorder: true,
  }
};