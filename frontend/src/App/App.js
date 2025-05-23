import {useState} from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import Main from '../views/Main';
import {useBackHandler, useCloseHandler, useDocumentEvent} from './AppState';
import {isDevServe} from '../libs/utils';
import { indexContext } from './Context';
import { stateContext ,globalCanvasContext} from './Context';
import SketchMain from '../views/SketchMain';

/* istanbul ignore next*/
if (isDevServe()) {
	window.webOSSystem = {
		highContrast: 'off',
		close: () => {},
		platformBack: () => {},
		PmLogString: () => {},
		screenOrientation: 'landscape',
		setWindowOrientation: () => {}
	};
}

const App = props => {
	const [index, setIndex] = useState(0);
	const [state, setState] = useState({
        canvasList: [],
		title: '',
		id: null, // id of current (opened) scatch. null means new scatch.
    });
	const [canvas, setCanvas] = useState();
	const [skinVariants, setSkinVariants] = useState({highContrast: false});
	const handleBack = useBackHandler();
	const handleClose = useCloseHandler();
	useDocumentEvent(setSkinVariants);

	return (
		<globalCanvasContext.Provider value={{canvas, setCanvas}}>
		<stateContext.Provider value={{state, setState}}>
		<indexContext.Provider value={{index, setIndex}}>
			<Panels
				{...props}
				index={index}
				skinVariants={skinVariants}
				onBack={handleBack}
				onClose={handleClose}
			>
				<Main />
				<SketchMain />
			</Panels>
		</indexContext.Provider></stateContext.Provider></globalCanvasContext.Provider>
	);
};

export default ThemeDecorator(App);
