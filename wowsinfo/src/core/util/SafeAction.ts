

// Add safe action to check if that screen already exists in the stack
// max is for the case where you need to push another same screen
export const SafeAction = (navigator: any, screen: string, obj: any = undefined, max = 0) => {
  // @ts-ignore
  // if (Actions.state.routes.filter(r => r.routeName === screen).length > max) {
    // console.log(`${screen} rejected`);
  // } else {
    navigator.navigate(screen, obj);
    // Actions.push(screen, obj);
    console.log(`${screen} pushed`);
  // }
};
