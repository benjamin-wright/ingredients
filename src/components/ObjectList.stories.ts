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
    await assertContent(options);
    await assertButtons(options, options.args.data[0], ['edit', 'delete']);
    await assertButtons(options, options.args.data[1], ['edit', 'delete']);
    await assertButtons(options, options.args.data[2], ['edit', 'delete']);
    await assertButtons(options, options.args.data[3], ['edit', 'delete']);
    await assertEdit(options);
    await assertDelete(options);
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
  play: async (options: any) => {
    await assertContent(options);
    await assertButtons(options, options.args.data[0], ['edit', 'delete']);
    await assertButtons(options, options.args.data[1], ['edit', 'delete']);
    await assertButtons(options, options.args.data[2], ['edit', 'delete']);
    await assertButtons(options, options.args.data[3], ['edit', 'delete']);
    await assertDelete(options);
    await assertEdit(options);
    await assertDropdown(options);
  },
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
  play: async (options: any) => {
    await assertContent(options);
    await assertButtons(options, options.args.data[0], ['edit', 'delete', 'swap'], ['up']);
    await assertButtons(options, options.args.data[1], ['edit', 'delete', 'swap'], ['up', 'down']);
    await assertButtons(options, options.args.data[2], ['edit', 'delete', 'swap'], ['up', 'down']);
    await assertButtons(options, options.args.data[3], ['edit', 'delete', 'swap'], ['down']);
    await assertDelete(options);
    await assertEdit(options);

    await assertSwap(options, options.args.data[0], options.args.data[1], 'up');
    await assertSwap(options, options.args.data[1], options.args.data[2], 'up');
    await assertSwap(options, options.args.data[2], options.args.data[1], 'down');
    await assertSwap(options, options.args.data[1], options.args.data[0], 'down');
    await assertSwap(options, options.args.data[3], options.args.data[2], 'down');
    await assertSwap(options, options.args.data[2], options.args.data[3], 'up');
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
    ...Default.args,
    reorder: true,
  }
};


async function assertContent(options: any) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');
  await expect(rows.map(el => el.textContent)).toStrictEqual([
    'John',
    'Jane',
    'Joe',
    'Jack',
  ]);
}

async function assertButtons(options: any, obj: any, expected: string[], expectedSwaps?: string[]) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');

  await options.step(`Buttons ${obj.name}`, async () => {
    await userEvent.click(rows[obj.id-1]);
    const buttons = await canvas.findAllByRole('button');
    await expect(buttons.map(b => b.ariaLabel)).toStrictEqual(expected);

    if (expectedSwaps) {
      const swapButton = await canvas.findByRole('button', { name: 'swap' });
      await userEvent.click(swapButton);
      const swapButtons = await canvas.findAllByRole('button');
      await expect(swapButtons.map(b => b.ariaLabel)).toStrictEqual(expectedSwaps);
    }
  });
};

async function assertDelete(options: any) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');

  for (const obj of options.args.data) {
    await options.step(`Delete ${obj.name}`, async () => {
      options.args.onDelete.mockClear();

      await userEvent.click(rows[obj.id-1]);
      const deleteButton = await canvas.findByRole('button', { name: 'delete' });
      await userEvent.click(deleteButton)

      const cancelButton = await canvas.findByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      await expect(options.args.onDelete).not.toHaveBeenCalled();
      
      await userEvent.click(deleteButton)
      const confirmButton = await canvas.findByRole('button', { name: 'OK' });
      await userEvent.click(confirmButton);
      await expect(options.args.onDelete).toHaveBeenCalledWith(obj);
    });
  }
}

async function assertEdit(options: any) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');

  for (const obj of options.args.data) {
    await options.step(`Edit ${obj.name}`, async () => {
      await userEvent.click(rows[obj.id-1]);
      const editButton = await canvas.findByRole('button', { name: 'edit' });
      await userEvent.click(editButton)
      await expect(options.args.onEdit).toHaveBeenCalledWith(obj);
    });
  }
}

async function assertDropdown(options: any) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');

  for (const obj of options.args.data) {
    await options.step(`Dropdown ${obj.name}`, async () => {
      await userEvent.click(rows[obj.id-1]);
      const dropdown = await canvas.findAllByRole('dropdown');
      await expect(dropdown.map(d => d.textContent)).toStrictEqual([`dropdown: ${obj.id}`]);
    });
  }
}

async function assertSwap(options: any, obj1: any, obj2: any, direction: string) {
  const canvas = within(options.canvasElement);
  const rows = await canvas.findAllByRole('content');

  await options.step(`Swap ${obj1.name} ${direction}`, async () => {
    await userEvent.click(rows[obj1.id-1]);
    const swapButton = await canvas.findByRole('button', { name: 'swap' });
    await userEvent.click(swapButton);
    const upButton = await canvas.findByRole('button', { name: direction });
    await userEvent.click(upButton);
    await expect(options.args.onSwap).toHaveBeenCalledWith(obj1, obj2);
  });
}