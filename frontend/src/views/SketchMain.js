import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {Header, Panel} from '@enact/sandstone/Panels';
import { indexContext, stateContext, canvasContext } from '../App/Context';
import { useContext, useState } from 'react';
import $L from '@enact/i18n/$L';
import Sketch from './Sketch';
import SketchSetting from './SketchSetting';


const SketchMain = props => {
	const {index, setIndex} = useContext(indexContext);
	const {state, setState} = useContext(stateContext);
	const [tmpCanvas, setTmpCanvas] = useState(null);


	const moveBack = () => {
		setIndex(0);				
		setState(prevState=>({...prevState, title: '', id: null}))
	}

	return (
		<canvasContext.Provider value={{tmpCanvas, setTmpCanvas}}>
		<Panel {...props}
			onBack={moveBack}
			>
			<Header title={$L('Sketch')} />
			<TabLayout>
				<Tab title={$L('Sketch')}>
					<Sketch />
				</Tab>
				<Tab title={$L('Setting')}>
					<SketchSetting />
				</Tab>
			</TabLayout>
		</Panel></canvasContext.Provider>
	);
};
export default SketchMain;
