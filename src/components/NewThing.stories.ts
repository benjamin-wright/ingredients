import NewThing from './NewThing.vue';
import { vueRouter } from 'storybook-vue3-router'

import '../assets/base.css';
import '../assets/main.css';

export default {
  component: NewThing,
  title: 'Components/NewThing',
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  decorators: [vueRouter([
    { path: '/', component: NewThing },
    { path: '/new-path', component: NewThing },
  ], { initialRoute: '/' })],
};

export const Default = {
  args: {
    to: '/new-path',
  },
  render: (args: any) => ({
    components: { NewThing },
    template: `
      <span role="assertion">Route: {{ $route.path }}</span>
      <NewThing to="${args.to}" />
    `,
  })
};