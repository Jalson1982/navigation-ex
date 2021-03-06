import * as React from 'react';
import { render } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import useNavigation from '../useNavigation';
import NavigationContainer from '../NavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

it('gets navigation prop from context', () => {
  expect.assertions(1);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();

    expect(navigation.navigate).toBeDefined();

    return null;
  };

  render(
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} />
      </TestNavigator>
    </NavigationContainer>
  );
});

it("gets navigation's parent from context", () => {
  expect.assertions(1);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();

    expect(navigation.dangerouslyGetParent()).toBeDefined();

    return null;
  };

  render(
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar" component={Test} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );
});

it("gets navigation's parent's parent from context", () => {
  expect.assertions(2);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();
    const parent = navigation.dangerouslyGetParent();

    expect(parent).toBeDefined();
    if (parent !== undefined) {
      expect(parent.navigate).toBeDefined();
    }

    return null;
  };

  render(
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo">
                {() => (
                  <TestNavigator>
                    <Screen name="quo" component={Test} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );
});

it('throws if called outside a navigation context', () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useNavigation()).toThrow(
      "We couldn't find a navigation object. Is your component inside a navigator?"
    );

    return null;
  };

  render(<Test />);
});
