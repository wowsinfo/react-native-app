export const getNavigator = (props: any) => {
    const navigator = props?.navigation;
    if (navigator) {
        return navigator;
    }

    return _navigator;
}

export const useGlobalNavigator = () => {
    return _navigator
}

// create a singleton for the navigator, temporary solution
let _navigator: any = null;
export const provideNavigator = (props: any) => {
    _navigator = getNavigator(props);
    console.log('Navigator provided');
    console.log(_navigator);
}
