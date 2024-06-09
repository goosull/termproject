import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import Dropdown from '@enact/sandstone/Dropdown';
import Slider from '@enact/sandstone/Slider';
import {fabric} from 'fabric';
import css from './Sketch.module.less';

const Sketch = () => {
	const [canvas, setCanvas] = useState();
	const [isDrawingMode, setIsDrawingMode] = useState(true);
	const [strokeWidth, setStrokeWidth] = useState(10);
	const [pickerColor, setPickerColor] = useState('#fff333');
	const [colorPicker, setIsColorPicker] = useState(false);
	const bgColor = useRef('#FFFFFF');

	function ColorToHex(color) {
		let hexadecimal = color.toString(16);
		return hexadecimal.length === 1 ? '0' + hexadecimal : hexadecimal;
	  }

	useEffect(() => {
		setCanvas(
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
				isDrawingMode: true,
				isEraseMode: false,
			})
		);
	}, []);

	const clearCanvas = useCallback(() => {
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
	}, [canvas]);

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
					canvas.freeDrawingBrush.color = pickerColor;
					setIsColorPicker(false);
					break;
				case "Select":
					canvas.isDrawingMode = false;
					setIsDrawingMode(false);
					canvas.isEraseMode = false;
					setIsColorPicker(false);
					break;
				case "Stroke Erase":
					canvas.isDrawingMode = true;
					setIsDrawingMode(true);
					canvas.isEraseMode = true;
					canvas.freeDrawingBrush.color = bgColor.current;
					setIsColorPicker(false);
					break;
				case "Normal Erase":
					canvas.isDrawingMode = true;
					setIsDrawingMode(true);
					canvas.isEraseMode = false;
					canvas.freeDrawingBrush.color = bgColor.current;
					setIsColorPicker(false);
					break;
				case "Color Picker":
					canvas.isDrawingMode = false;
					setIsDrawingMode(false);
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
			canvas.on("mouse:down", e => { // color picker
				if(colorPicker && canvas.isDrawingMode === false && canvas.isEraseMode === false){
					const pointer = canvas.getPointer(e.e);
					const color = canvas.getContext('2d').getImageData(pointer.x, pointer.y, 1, 1).data;
					const hex = '#' + ColorToHex(color[0]) + ColorToHex(color[1]) + ColorToHex(color[2]);
					console.log(hex);
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
		console.log(e.target.value);
	}, []);

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = strokeWidth;
		}
	}, [canvas, strokeWidth]);

	const changeWidth = useCallback((e) => {
		setStrokeWidth(Number(e.value));

	}, []);

	return (
		<div>
			<Button
				icon="trash"
				iconOnly
				backgroundOpacity="opaque"
				onClick={clearCanvas}
			/>
			<Button
				icon="download"
				iconOnly
				backgroundOpacity="opaque"
				onClick={downloadCanvas}
			/>
			<span style={{ marginLeft: '5px' }}>Mode</span>
			<Dropdown
				backgroundOpacity="opaque"
				children={["Paint", "Object Select", "Stroke Erase", "Normal Erase", "Color Picker"]}
				onSelect={swapMode}
			/>
			<input
				type="color"
				defaultValue={pickerColor}
				onChange={changeColor}
				className={css.colorInput}
			/>
			<Slider
				defaultValue={20}
				max={100}
				min={1}
				onChange={changeWidth}
				step = {1}
				classNamme	= {css.slider}
				orientation = "horizontal"
			/>
			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;
