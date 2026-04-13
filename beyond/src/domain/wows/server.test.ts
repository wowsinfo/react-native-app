import {describe, expect, test} from 'bun:test';
import {getServerDefinition, listServerDefinitions} from './server';

describe('server definitions', () => {
  test('maps north america to the legacy com domain', () => {
    expect(getServerDefinition('na')).toEqual({
      id: 'na',
      name: 'North America',
      apiDomain: 'com',
      prefix: 'na',
    });
  });

  test('lists the four supported regions', () => {
    expect(listServerDefinitions().map((server) => server.id)).toEqual([
      'ru',
      'eu',
      'na',
      'asia',
    ]);
  });
});

