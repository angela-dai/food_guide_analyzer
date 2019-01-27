import React, { Component } from 'react';
import Camera from 'react-camera';
import TagsInput from 'react-tagsinput'
import FoodIcon from './FoodIcon.png';
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import './App.css';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';

import LineChart from 'react-linechart';
import WordCloud from 'react-d3-cloud';

const Handle = Slider.Handle;

const config = require('./config.json');
const backend_url = config.url;

const rectangleStyle = {
    width: '800px',
    height: '50px',
    background: 'lightblue'
};

class App extends Component {
    constructor(props) {
        super(props);
        this.takePicture = this.takePicture.bind(this);
        this.state = {
            dataCapture: null,
            tags: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    goHome() {
        this.setState({dataCapture: "HomePage"});
    }

    goPhoto() {
        this.setState({dataCapture: null});
    }

    sendData = (data) => {
        var fd = new FormData();
        fd.append('image', data)

        fetch(`${backend_url}/submission`, {
            method: 'POST',
            body: fd
        }).then((response) => response.json())
            .then((result) => {
                console.log(result);
                this.handleChange(result.tags);
            });
    }

    handleInputEvent(evt) {
        console.log(evt);
        this.img = this.refs.CameraImg;
        this.img.src = URL.createObjectURL(evt.target.files[0]);
        this.img.onload = () => { URL.revokeObjectURL(this.src); }
        this.setState({dataCapture: 'PictureTaken'});
        console.log(this.img)
        this.sendData(evt.target.files[0]);
    }

    takePicture() {
        try{
            this.camera.capture()
                .then(blob => {
                    console.log(blob)
                    this.img = this.refs.CameraImg;
                    this.img.src = URL.createObjectURL(blob);
                    this.img.onload = () => { URL.revokeObjectURL(this.src); }
                    this.setState({dataCapture: 'PictureTaken'});
                    console.log(this.img)
                    this.sendData(blob)
                })
        } catch(err) {
            this.inputElement.onchange = this.handleInputEvent.bind(this)
            this.inputElement.click();
        }
    }

    handleChange(tagsIn) {
        // API Get
        console.log(tagsIn)
        this.setState({tags: tagsIn})
    }

    render() {
        if (this.state.dataCapture === null) { //Photo branch
            return (
                <div className="App" style={style.backgroundColorCont}> 
                <header className="App-header" style={{backgroundColor: "lightblue"}}>
                <img src={FoodIcon} className="App-logo" alt="" />
                <p>
                Food Analyzer Pro
                </p>
                <div style={style.container}>
                <Camera
                style={style.preview}
                ref={(cam) => {
                    this.camera = cam;
                }}
                video={{"facingMode":"environment"}}
                >
                <div style={style.captureContainer} onClick={this.takePicture}>
                <div style={style.captureButton} />
                <input
                    ref={input => this.inputElement = input}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/bmp"
                    style={{display: 'none'}} />
                </div>
                </Camera>
                <img src={this.img} ref="CameraImg"/>
                </div>
                </header>
                </div>
            );
        } else if (this.state.dataCapture === 'PictureTaken') {
            console.log("return!")
            return (
                <div>
                <div id="rectangle" style={rectangleStyle}></div>
                <TagsInput value={this.state.tags} onChange={this.handleChange} />
                <div>
                <Accordion>
                <AccordionItem>
                <AccordionItemTitle>
                <h3>Tags</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                <p>What Names</p>
                </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                <AccordionItemTitle>
                <h3>Calories</h3>
                <div>Understand!</div>
                </AccordionItemTitle>
                <AccordionItemBody>
                <p>Body content</p>
                </AccordionItemBody>
                </AccordionItem>
                </Accordion>
                </div>
                <div>
                <div className='rowC' style={{display:"flex", flexDirection:"row"}}>
                Vegetables {" "} <Slider min={0} max={100} defaultValue={0} handle={handle} />
                </div>
                <div className='rowC' style={{display:"flex", flexDirection:"row"}}>
                Proteins {" "} <Slider min={0} max={100} defaultValue={0} handle={handle} />
                </div>
                <div className='rowC' style={{display:"flex", flexDirection:"row"}}>
                Grains {" "} <Slider min={0} max={100} defaultValue={0} handle={handle} />
                </div>
                </div>
                <div>
                <button onClick={() => this.goHome()}>
                Go Home
                </button>
                </div>
                </div>
            );
        } else if (this.state.dataCapture === 'HomePage') {
            var data;
            var data2;
              console.log("return! HomePage")
              fetch('http://localhost:3001/trends', {
                  method: 'GET'
              }).then((response) => response.json())
                  .then((result) => {
                      data = JSON.parse(result);
                  });
                  fetch('http://localhost:3001/tags', {
                      method: 'GET',
                  }).then((response) => response.json())
                      .then((result) => {
                          data2 = JSON.parse(result);
                      });
                // const data = [
                //     {
                //         color: "steelblue",
                //         points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}]
                //     }
                // ];
                // const data2 = [
                //   { text: 'Hey', value: 1000 },
                //   { text: 'lol', value: 200 },
                //   { text: 'first impression', value: 800 },
                //   { text: 'very cool', value: 1000000 },
                //   { text: 'duck', value: 10 },
                // ];
              return (
                  <div>
                      <div className="App">
                          <h1>Food Trend</h1>
                          <LineChart
                              width={600}
                              height={400}
                              data={data}
                          />
                      </div>
                      <div>
                        <WordCloud
                          data={data2}
                          fontSizeMapper={fontSizeMapper}
                        />
                      </div>
                      <div>
                        <button onClick={() => this.goPhoto()}>
                            Take Photo
                        </button>
                      </div>
                  </div>
                );
            }
        }
    }


const fontSizeMapper = word => Math.log2(word.value) * 5;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
        >
        <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

const style = {
    preview: {
        position: 'relative',
    },
    backgroundColorCont: {
        backgroundColor: "#FF0000",
    },
    captureContainer: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 1,
        bottom: 0,
        width: '100%'
    },
    captureButton: {
        backgroundColor: '#fff',
        borderRadius: '50%',
        height: 56,
        width: 56,
        color: '#000',
        margin: 20
    },
    captureImage: {
        width: '100%',
    }
};

export default App;
