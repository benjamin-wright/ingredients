import NewThing from './NewThing.vue';
import { vueRouter } from 'storybook-vue3-router'

import '../assets/base.css';
import '../assets/main.css';

export default {
  component: NewThing,
  title: 'Components/NewThing',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    to: { action: 'to' },
  },
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  decorators: [vueRouter()],
};

export const Default = {
  args: {
    to: '/path',
  },
};