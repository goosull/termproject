/* eslint-disable enact/prop-types */
import { stateContext, indexContext, canvasContext, globalCanvasContext} from '../App/Context';
import {useCallback, useState, useEffect, useRef, useContext} from 'react';
import {fabric} from 'fabric';
import { InputField } from '@enact/sandstone/Input';
import axios from 'axios';
import Button from '@enact/sandstone/Button';
import Dropdown from '@enact/sandstone/Dropdown';
import LoginInfo from '../App/LoginInfo';
import css from './Sketch.module.less';
import Slider from '@enact/sandstone/Slider';
import Popup from '@enact/sandstone/Popup'
import $L from '@enact/i18n/$L';


const Sketch = () => {
	const {canvas, setCanvas} = useContext(globalCanvasContext);
	const {tmpCanvas, setTmpCanvas} = useContext(canvasContext);
	const bgColor = useRef('#FFFFFF');
	const [drawingMode, setDrawingMode] = useState(0);
	const [strokeWidth, setStrokeWidth] = useState(10);
	const [pickerColor, setPickerColor] = useState('#000000');
	const [colorPicker, setIsColorPicker] = useState(false);
	const {state, setState} = useContext(stateContext);
	const [canvasHistory, setHistory] = useState({
		history: [],
		size: 0,
		pointer: -1,
		max_size: 10,
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
			if (this.size > this.max_size) {
				this.history.shift();
				this.size = this.size-1;
				this.pointer = this.pointer-1;
			}
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
	});
	const [loginPopup, loginPopupOpen] = useState(false);
	const [savePopup, savePopupOpen] = useState(false);
	const [titlePopup, titlePopupOpen] = useState(false);
	function ColorToHex(color) {
		let hexadecimal = color.toString(16);
		return hexadecimal.length === 1 ? '0' + hexadecimal : hexadecimal;
	}

	// Load all canvas of user
	const fetchList = async() => {
		try {
			const response = await axios.get('/api/canvas/?user='+LoginInfo.name);
			setState(prevState=>({...prevState,  canvasList: response.data}));
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		setCanvas(new fabric.Canvas('my_canvas', {
			height: 780,
			width: 1700,
			backgroundColor: bgColor.current,
			isDrawingMode: true
		}))
		fetchList();
	}, []);

	const updateCanvasHistory = ()=>{
		canvasHistory.update(canvas.toJSON());
		setTmpCanvas(canvas.toJSON());
	}


	// Erase canvas
	const clearCanvas = useCallback(() => {
		console.log(LoginInfo);
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
		canvasHistory.update(canvas.toJSON());
	}, [canvas]);

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
					setDrawingMode(0);
					canvas.isDrawingMode = true;
					canvas.isEraseMode = false;
					canvas.freeDrawingBrush.color = pickerColor;
					setIsColorPicker(false);
					break;
				case "Select":
					setDrawingMode(1);
					canvas.isDrawingMode = false;
					canvas.isEraseMode = false;
					setIsColorPicker(false);
					break;
				case "Stroke Erase":
					setDrawingMode(2);
					canvas.isDrawingMode = true;
					canvas.isEraseMode = true;
					canvas.freeDrawingBrush.color = bgColor.current;
					setIsColorPicker(false);
					break;
				case "Normal Erase":
					setDrawingMode(3);
					canvas.isDrawingMode = true;
					canvas.isEraseMode = false;
					canvas.freeDrawingBrush.color = bgColor.current;
					setIsColorPicker(false);

					break;
				case "Color Picker":
					canvas.isDrawingMode = false;
					setDrawingMode(4);
					canvas.isEraseMode = false;
					setIsColorPicker(true);
					break;
				default:
					break;
			}
		}
	}, [canvas, pickerColor]);


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
            if (state.id && !tmpCanvas) loadCanvas(state.id);
			if (tmpCanvas && canvas.lowerCanvasEl) {
				canvas.loadFromJSON(tmpCanvas);
			}
			canvas.on("mouse:down", e => { // color picker
				if(drawingMode === 4 && canvas.isDrawingMode === false && canvas.isEraseMode === false){
					const pointer = canvas.getPointer(e.e);
					const color = canvas.getContext('2d').getImageData(pointer.x, pointer.y, 1, 1).data;
					const hex = '#' + ColorToHex(color[0]) + ColorToHex(color[1]) + ColorToHex(color[2]);
					console.log(canvas.getContext('2d').getImageData(pointer.x, pointer.y, 1, 1))
					setPickerColor(hex);
				}
			});
		}
	}, [canvas, colorPicker]);

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

	// Save new canvas or update already existing canvas.
	const saveCanvas = useCallback(() => {
		// Can save only when logged in.
		if (LoginInfo.id != null) {
			if (state.title == '') {
				titlePopupOpen(true);
				return;
			}
			// Save new canvas.
			if (state.id == null) {
				axios
					.post('/api/canvas', {title: state.title, canvas:canvas.toObject(), thumb:canvas.toDataURL({multiplier:0.25, format: 'png'}), user:[LoginInfo.name]})
					.then(response => {
                        console.log(response);
						setState(prevState=>({
							...prevState,
							canvasList: [...prevState.canvasList, response.data],
							id:response.data._id,
						}));
					})
					.then(()=>{savePopupOpen(true)})
					.catch(error => console.error(error));
			} else {
				// Update existing canvas.
				savePopupOpen(true);
				axios
					.put('/api/canvas/'+state.id, {title: state.title, canvas:canvas.toObject(), thumb:canvas.toDataURL({multiplier:0.25, format: 'png'})})
					.then(()=>{
						fetchList();
					})
					.then(()=>{savePopupOpen(true)})
					.catch(error => console.error(error));
			}
		} else {
			loginPopupOpen(true);
		}
	});

	// Load selected canvas from Dropdown menu.
	const loadCanvas = async(id) => {
		try {
			const response = await axios.get('/api/canvas/'+id);
			setState(prevState=>({...prevState, title: response.data.title, id:response.data._id}));
			canvas.loadFromJSON(response.data.canvas);
			canvasHistory.init(canvas.toJSON())
		} catch (error) {
			console.log(error);
		}
	}

	const doRedo = () =>{
		canvas.loadFromJSON(canvasHistory.redo());
	}
	const doUndo = () =>{
		canvas.loadFromJSON(canvasHistory.undo());
	}
    
	return (
        <div>
			<div>
			<InputField
				type="text"
				value={state.title}
				onChange={e => setState(prev => ({...prev, title: e.value}))}
				placeholder="Title"
			/>
			</div>

			<Button
				icon="trash"
				backgroundOpacity="opaque"
				iconOnly='true'
				onClick={clearCanvas}
			/>
			<Button
				icon="files"
				backgroundOpacity="opaque"
				iconOnly='true'
				onClick={saveCanvas}
			/>
			<Button
				icon="arrowhookleft"
				backgroundOpacity="opaque"
				iconOnly='true'
				onClick={doUndo}
			/>
			<Button
				icon="arrowhookright"
				backgroundOpacity="opaque"
				iconOnly='true'
				onClick={doRedo}
			/>
			<Button
				icon="closex"
				backgroundOpacity="opaque"
				iconOnly='true'
				onClick={handleDelete}
			/>
			<span style={{ marginLeft: '5px' }}>Mode</span>
			<Dropdown
				backgroundOpacity="opaque"
				selected={drawingMode}
				children={["Paint", "Select", "Stroke Erase", "Normal Erase", "Color Picker"]}
				onSelect={swapMode}
			/>
			<input
				type="color"
				defaultValue={pickerColor}
				value={pickerColor}
				onChange={changeColor}
				className={css.colorInput}
				disabled = {drawingMode === 3 || drawingMode === 2}
			/>

			<Slider
				defaultValue={20}
				max={100}
				min={1}
				onChange={changeWidth}
				step = {1}
				className	= {css.slider}
				orientation = "horizontal"
			/>

			<canvas id="my_canvas" />

			<Popup type="overlay" open={loginPopup} onClose={()=>loginPopupOpen(false)}>
				<span>{$L('Please login.')}</span>
			</Popup>
			<Popup type="overlay" open={savePopup} onClose={()=>savePopupOpen(false)}>
				<span>{$L('Saved.')}</span>
			</Popup>
			<Popup type="overlay" open={titlePopup} onClose={()=>titlePopupOpen(false)}>
				<span>{$L('Please enter a title.')}</span>
			</Popup>
        </div>
    )
	
};
export default Sketch;