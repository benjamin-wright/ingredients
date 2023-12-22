import ObjectList from './ObjectList.vue';

import '../assets/base.css';
import '../assets/main.css';

const data = {
    objects: [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
        { id: 4, name: 'four' },
    ]
};

const getId = {
    objects: (item) => item.id
};

export default {
  component: ObjectList,
  title: 'Components/ObjectList',
  argTypes: {
    data: {
        options: Object.keys(data),
        mapping: data,
        control: { type: 'select' },
    },
    dropdown: {},
    reorder: {},
    confirmationMessage: { control: 'text' },
    getId: {
        options: Object.keys(getId),
        mapping: getId,
        control: { type: 'select' },
    },
    onDelete: { action: 'delete' },
    onEdit: { action: 'edit' },
    onSwap: { action: 'swap' },
  },
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    data: data.objects,
    dropdown: true,
    reorder: false,
    confirmationMessage: 'sure?',
    getId: getId.objects,
  },
  render: (args, { argTypes }) => ({
    components: { ObjectList },
    props: Object.keys(argTypes),
    template: `
      <ObjectList v-bind="$props" @delete="onDelete" @edit="onEdit" @swap="onSwap">
        <template #default="{ item }">
          <div>Hi {{ item.name }}</div>
        </template>
        <template #dropdown="{ item }">
          <div>Dropdown {{ item.name }}</div>
        </template>
      </ObjectList>
    `,
  }),
};