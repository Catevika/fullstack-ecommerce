declare module 'react-native-web' {
  export const AppRegistry: {
    registerComponent: (name: string, getComponent: () => unknown) => void;
    getApplication: (name: string) => {
      getStyleElement: () => React.ReactElement;
    };
  };
}