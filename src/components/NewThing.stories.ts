import NewThing from './NewThing.vue';
import { vueRouter } from 'storybook-vue3-router'
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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
  play: async (options: any) => {
    const canvas = within(options.canvasElement);
    const button = await canvas.findByRole('button');

    const old_route = await canvas.findByRole('assertion');
    expect(old_route.textContent).toBe('Route: /');

    await userEvent.click(button);
    const new_route = await canvas.findByRole('assertion');
    expect(new_route.textContent).toBe('Route: /new-path');
  },
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