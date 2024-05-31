import axios from 'axios';
import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import {Dropdown, DropdownBase} from '@enact/sandstone/Dropdown';
import {fabric} from 'fabric';
import { InputField } from '@enact/sandstone/Input';
import LoginInfo from '../App/LoginInfo';

const Sketch = () => {
	const [canvas, setCanvas] = useState();
	const bgColor = useRef('#FFFFFF');
	const [state, setState] = useState({
		canvasList: [],
		title: '',
		id: null, // id of current (opened) scatch. null means new scatch.
	});

	// Load all canvas of user
	const fetchList = async() => {
		try {
			const response = await axios.get('/api/canvas/?userid='+LoginInfo.id);
			setState(prevState=>({...prevState,  canvasList: response.data}));
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		setCanvas(
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
				isDrawingMode: true
			})
		);
		fetchList();
	}, []);


	// Erase canvas
	const clearCanvas = useCallback(() => {
		console.log(LoginInfo);
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
	}, [canvas]);
	
	// Delete saved canvas
	const deleteCanvas = useCallback(() => {
		canvas.clear();
		canvas.backgroundColor = bgColor.current;

		if (state.id != null) {
			axios
				.delete('/api/canvas/'+state.id)
				.then(()=>{fetchList();})
				.then(()=>{setState(prevState=>({...prevState, title: '', id: null}))})
				.catch(error => console.error(error));
		}

	}, [canvas, state]);

	const downloadCanvas = useCallback(() => {}, []);

	// Make new canvas which is not saved.
	const newCanvas = useCallback(() => {
		setState(prevState=>({
			...prevState,
			title: '',
			id: null,
		}))
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
	}, [canvas]);

	// Save new canvas or update already existing canvas.
	const saveCanvas = useCallback(() => {
		// Can save only when logged in.
		if (LoginInfo.id != null) {
			// Save new canvas.
			if (state.id == null) {
				axios
					.post('/api/canvas', {title: state.title, canvas:canvas.toObject(), user:[LoginInfo.id]})
					.then(response => {
						setState(prevState=>({
							...prevState,
							canvasList: [...prevState.canvasList, response.data],
							id:response.id,
						}));
					})
					.catch(error => console.error(error));
			} else {
				// Update existing canvas.
				axios
					.put('/api/canvas/'+state.id, {title: state.title, canvas:canvas.toObject()})
					.then(()=>{
						fetchList();
					})
					.catch(error => console.error(error));
			}
		}
	});

	// Load selected canvas from Dropdown menu.
	const loadCanvas = async(selected) => {
		let id = state.canvasList[selected.selected]._id;
		try {
			const response = await axios.get('/api/canvas/'+id);
			setState(prevState=>({...prevState, title: response.data.title, id:response.data._id}));
			canvas.loadFromJSON(response.data.canvas);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<Button
				icon="trash"
				iconOnly
				backgroundOpacity="opaque"
				onClick={clearCanvas}
			/>
			<Button
				icon="trash"
				iconOnly
				backgroundOpacity="opaque"
				onClick={deleteCanvas}
			/>
			<Button
				icon="download"
				iconOnly
				backgroundOpacity="opaque"
				onClick={downloadCanvas}
			/>
			<Button
				icon="plus"
				iconOnly
				backgroundOpacity="opaque"
				onClick={newCanvas}
			/>
			<Button
				icon="files"
				iconOnly
				backgroundOpacity="opaque"
				onClick={saveCanvas}
			/>
			<Dropdown
				defaultSelected={0}
				inline
				title="Load Canvas"
				onSelect={loadCanvas}
				>
				{Array.isArray(state.canvasList) ? (
					state.canvasList.map(canvas_data => canvas_data.title)
				) : []}
				
			</Dropdown>

			<InputField
				type="text"
				value={state.title}
				onChange={e => setState(prev => ({...prev, title: e.value}))}
				placeholder="Name"
			/>

			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;
