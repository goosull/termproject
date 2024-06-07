/* eslint-disable enact/prop-types */
import {Header, Panel} from '@enact/sandstone/Panels';
import Item from '@enact/sandstone/Item';
import {useCallback} from 'react';
import { useContext } from 'react';
import { stateContext, indexContext} from '../App/Context';
import { useSettingBackHandler } from '../App/AppState';

const SettingPanel = props => {
    const {state, setState} = useContext(stateContext);
    const {index, setIndex} = useContext(indexContext);
    const useSettingBackHandler = () => useCallback(() => {setIndex(0);}, []);
    const handleBack = useSettingBackHandler();

    
	return (
        <Panel 
            {...props}
            onBack={handleBack}
        >
			<Header title={(state.title == '') ? '(Untitled Scatch)' : state.title} />
        </Panel>
    )
	
};

export default SettingPanel;