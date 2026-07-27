import {Actions} from '../navigation/Actions';

// Add safe action to check if that screen already exists in the stack
// max is for the case where you need to push another same screen
export const SafeAction = (screen: string, obj: Record<string, unknown> = undefined, max = 0) => {
  if (Actions.state.routes.filter((r: Record<string, unknown>) => r.name === screen).length > max) {
    console.log(`${screen} rejected`);
  } else {
    Actions.push(screen, obj);
    console.log(`${screen} pushed`);
  }
};
