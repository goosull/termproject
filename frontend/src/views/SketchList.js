import axios from 'axios';
import { useCallback, useState, useEffect, useContext } from 'react';
import { globalCanvasContext, indexContext, stateContext } from '../App/Context';
import LoginInfo from '../App/LoginInfo';
import ImageItem from '@enact/sandstone/ImageItem'
import Button from '@enact/sandstone/Button';
import $L from '@enact/i18n/$L';

const SketchList = () => {
	const index = useContext(indexContext);
	const {state, setState} = useContext(stateContext);
	const {canvas, setCanvas} = useContext(globalCanvasContext);
	const [canvIdx, setCanvIdx] = useState(0);

	const editCanvas = (canv)=>{
		if (canv == null)  setState(prevState=>({...prevState, id: null, title: ''}))
		else setState(prevState=>({...prevState, id: canv._id, title: canv.title}))
		index.setIndex(1);
	};

	// Load all canvas of user
	const fetchList = async() => {
		try {
			const response = await axios.get('/api/canvas/?user='+LoginInfo.name);
			setState(prevState=>({...prevState,  canvasList: response.data}));
		} catch (error) {
			console.log(error);
		}
	}

	const nextCanv = useCallback(()=> {
		if (Array.isArray(state.canvasList) && canvIdx+1 < state.canvasList.length) {
			setCanvIdx(prevState=>(prevState+1));
		}
	})
	const prevCanv = useCallback(()=> {
		if (Array.isArray(state.canvasList) && canvIdx-1 >= 0) {
			setCanvIdx(prevState=>(prevState-1));
		}
	})

	useEffect(()=>{
		fetchList();
		if (canvas && canvas.lowerCanvasEl) canvas.dispose();
		setCanvIdx(0);
	}, []);


	return (
		<div>
			<Button
				icon="plus"
				backgroundOpacity="opaque"
				onClick={()=>editCanvas(null)}
			>
				{$L('New Sketch')}
			</Button>
			<h2>Sketch List</h2>
			{(Array.isArray(state.canvasList) && state.canvasList.length>canvIdx) ? (
				<div>
				<ImageItem
					src={state.canvasList[canvIdx].thumb}
					style={{height:360, width:850}}
					onClick={()=>editCanvas(state.canvasList[canvIdx])}
					>
					{state.canvasList[canvIdx].title}
				</ImageItem>
				<Button
					icon="arrowlargeleft"
					onClick={prevCanv}>
				</Button>
				<Button
					icon="arrowlargeright"
					onClick={nextCanv}>
				</Button>
				</div>
			) : (<div></div>)}
		</div>
	);
};

export default SketchList;
