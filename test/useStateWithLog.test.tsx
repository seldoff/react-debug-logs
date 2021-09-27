import {useState} from '../src/useStateWithLog';
import renderer from 'react-test-renderer';

it('should be awesome', () => {
    const Component = () => {
        useState('some_state');
        return <span></span>;
    }

    const component = renderer.create(<Component/>);

    expect(component).toBeTruthy();
});