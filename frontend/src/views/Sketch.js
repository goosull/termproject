import axios from 'axios';
import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import {Dropdown, DropdownBase} from '@enact/sandstone/Dropdown';
import {fabric} from 'fabric';
import { InputField } from '@enact/sandstone/Input';
import LoginInfo from '../App/LoginInfo';
import css from './Sketch.module.less';
import Slider from '@enact/sandstone/Slider';
import {useContext} from 'react';
import { indexContext } from '../App/Context';
import { stateContext } from '../App/Context';
import ImageItem from '@enact/sandstone/ImageItem'

const Sketch = () => {
	const [canvas, setCanvas] = useState();
	const bgColor = useRef('#FFFFFF');
	const [isDrawingMode, setIsDrawingMode] = useState(true);
	const [strokeWidth, setStrokeWidth] = useState(10);
	const [pickerColor, setPickerColor] = useState('#fff333');
	const index = useContext(indexContext);
	const {state, setState} = useContext(stateContext)
	const [canvasHistory, setHistory] = useState({
		history: [],
		size: 0,
		pointer: -1,
		init: function(sketch) {
			this.history = [];
			this.size=1;
			this.pointer=0;
			this.history.push(sketch);
		},
		update: function (sketch) {
			if (this.size-1 != this.pointer) {
				this.history = this.history.slice(0, this.pointer+1);
				this.size = this.pointer+1;
			}
			this.history.push(sketch);
			this.pointer = this.pointer+1;
			this.size = this.size+1;
		},
		undo: function () {
			if (this.pointer-1 >= 0) {
				this.pointer = this.pointer-1;
				return this.history[this.pointer];
			}
		},
		redo: function (){
			if (this.pointer+1 < this.size) {
				this.pointer = this.pointer+1;
				return this.history[this.pointer];
			}
		}	
	})

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
		setCanvas(new fabric.Canvas('canvas', {
			height: 780,
			width: 1700,
			backgroundColor: bgColor.current,
			isDrawingMode: true
		}))
		fetchList();
	}, []);

	const updateCanvasHistory = ()=>{
		canvasHistory.update(canvas.toJSON());
		console.log(canvasHistory);
	}


	// Erase canvas
	const clearCanvas = useCallback(() => {
		console.log(LoginInfo);
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
		canvasHistory.update(canvas.toJSON());
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

	// Delete selected object
	const handleDelete = useCallback(() => {
		if (canvas){
			const activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.remove(activeObject);
				canvas.renderAll();
			}

			const activeGroup = canvas.getActiveObjects();
			if (activeGroup) {
				activeGroup.forEach((obj) => {
					canvas.remove(obj);
					canvas.renderAll();
				});
			}
		}
	}, [canvas]);

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Delete' || event.key === 'Backspace') {
				handleDelete();
			}
		});
	}, [handleDelete]);

	const swapMode = useCallback((mode) => {
		if (canvas) {
			switch (mode.data) {
				case "Paint":
					canvas.isDrawingMode = true;
					setIsDrawingMode(true);
					canvas.isEraseMode = false;
					canvas.freeDrawingBrush.color = '#000000';
					setPickerColor('#000000')
					break;
				case "Select":
					canvas.isDrawingMode = false;
					setIsDrawingMode(false);
					canvas.isEraseMode = false;
					break;
				case "Stroke Erase":
					canvas.isDrawingMode = true;
					setIsDrawingMode(true);
					canvas.isEraseMode = true;
					canvas.freeDrawingBrush.color = bgColor.current;
					break;
				case "Normal Erase":
					canvas.isDrawingMode = true;
					setIsDrawingMode(true);
					canvas.isEraseMode = false;
					canvas.freeDrawingBrush.color = bgColor.current;
					break;
				default:
					break;
			}
		}
	}, [canvas]);


	useEffect(() => {
		if (canvas) {
			canvas.on("path:created", e => { // delete path
				const path = e.path;
				if (canvas.isEraseMode) {
					const objects = canvas.getObjects();
					for (let i = 0; i < objects.length; i++) {
						if (objects[i].intersectsWithObject(path)) {
							canvas.remove(objects[i]);
							break;
						}
					}
					canvas.remove(path); // 지우개 경로 자체도 제거
				}
			});
			canvas.on({
				'mouse:up': updateCanvasHistory,
			});
			canvasHistory.init(canvas.toJSON())
		}
	}, [canvas]);

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.color = pickerColor;
		}
	}, [canvas, pickerColor]);

	const changeColor = useCallback((e) => {
		setPickerColor(e.target.value);
	}, []);

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = strokeWidth;
		}
	}, [canvas, strokeWidth]);

	const changeWidth = useCallback((e) => {
		setStrokeWidth(Number(e.value));

	}, []);

	// Make new canvas which is not saved.
	const newCanvas = useCallback(() => {
		setState(prevState=>({
			...prevState,
			title: '',
			id: null,
		}))
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
		canvasHistory.init(canvas.toJSON());
	}, [canvas]);

	// Save new canvas or update already existing canvas.
	const saveCanvas = useCallback(() => {
		// Can save only when logged in.
		if (LoginInfo.id != null) {
			// Save new canvas.
			if (state.id == null) {
				axios
					.post('/api/canvas', {title: state.title, canvas:canvas.toObject(), thumb:canvas.toDataURL({multiplier:0.25, format: 'png'}), user:[LoginInfo.id]})
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
					.put('/api/canvas/'+state.id, {title: state.title, canvas:canvas.toObject(), thumb:canvas.toDataURL({multiplier:0.25, format: 'png'})})
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
			canvasHistory.init(canvas.toJSON())
		} catch (error) {
			console.log(error);
		}
	}

	const loadThumb = async() => {
		try {
			const response = await axios.get('/api/canvas/thumb/666332da24abd499ce6bebaf');
			return response.data;
		} catch (error) {
			console.log(error);
		}
	}
	const settingCanvas = ()=>{
		index.setIndex(1);
	};

	const doRedo = () =>{
		canvas.loadFromJSON(canvasHistory.redo());
	}
	const doUndo = () =>{
		canvas.loadFromJSON(canvasHistory.undo());
	}

	console.log(state.canvasList.map(canv=>canv.title));

	return (
		<div>
			{Array.isArray(state.canvasList) ? (
				<ul>
					{state.canvasList.map(canv=>{
						<li>
							{canv.title}
							<ImageItem
								src={canv.thumb} label="test">
									caption
							</ImageItem>
						</li>
					})}
				</ul>
			) : (
				<p>ERROR</p>
			)}
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
			<Button
				icon="setting"
				iconOnly
				backgroundOpacity="opaque"
				onClick={settingCanvas}
			/>
			<Button
				icon="redo"
				iconOnly
				backgroundOpacity="opaque"
				onClick={doRedo}
			/>
			<Button
				icon="undo"
				iconOnly
				backgroundOpacity="opaque"
				onClick={doUndo}
			/>

			<span style={{ marginLeft: '5px' }}>Mode</span>
			<Dropdown
				backgroundOpacity="opaque"
				children={["Paint", "Select", "Stroke Erase", "Normal Erase"]}
				onSelect={swapMode}
			/>
			<input
				type="color"
				defaultValue={pickerColor}
				onChange={changeColor}
				className={css.colorInput}
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

			<Slider
				defaultValue={20}
				max={100}
				min={1}
				onChange={changeWidth}
				step = {1}
				classNamme	= {css.slider}
				orientation = "horizontal"
			/>

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
