/**
 * @format
 */

import 'react-native';
import React from 'react';
import {Main as App} from '../../index';

import {it} from '@jest/globals';

// Note: test renderer must be required after react-native
import renderer from 'react-test-renderer';

// Test app render correcly
it('wows info main entry renders correctly', () => {
  renderer.create(<App />);
});
