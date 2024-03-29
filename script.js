function rdm (max){
    return Math.floor(Math.random()*(max +1));
};
function random ( min, max, floor){
    if (floor) return Math.floor((Math.random()*(max - min + 1)) + min);
    return (Math.random()*(max - min)) + min;
};
function rdmAround (x, floor){
    if (floor) return Math.floor( Math.random()* x * 2 - x )
    return Math.random()* x * 2 - x
}
function write (input){
    console.log('%c' +  JSON.stringify(input), 'color: #8BF');
    return void 0;
};
function error (input){
    console.log('%c' + JSON.stringify(input), 'color: #F54;');
    return void 0;
};
function $ (id){
    return document.getElementById(id);
};
function randomColor (){
    return `hsl( ${rdm(360)}, ${random( 20, 70, true)}%, 50%)`
};
function pause (){
    paused = true
};
function play (){
    paused = false
};
function average( values ){
    return Math.floor(( values[0] + values[1] ) / 2)
}
function countCells(){
    let count = {}
    for ( let i in types ){
        count[i] = 0
    }
    for ( let y of world ){
        for ( let x of y ){
            count[x.type] += 1
        }
    }
    return count
}

let canvas = $('canvas')
let c = canvas.getContext('2d')
let width = $('container').clientWidth
let height = $('container').clientHeight
let max_stepsPerSecond = 35
let res = 10
let paused = false

canvas.width = width
canvas.height = height

c.fillStyle = '#CCC'
c.strokeStyle = '#CCC'
c.font = '10px monospace'

let mouse = {
    x: width/2,
    y: height/2,
    z: false,
    size: 4,
    density: 0,
}
canvas.addEventListener( 'mousemove', ( event)=>{
    mouse.x = event.x
    mouse.y = event.y
})
canvas.addEventListener( 'mousedown', ()=>{
    mouse.z = true
})
window.addEventListener( 'mouseup', ()=>{
    mouse.z = false
})


let types = {
    air: {
        displayName: 'air',
        hueRange: [ 0, 0 ],
        saturationRange: [ 0, 0 ],
        lightnessRange: [ 0, 0 ],
        alphaRange: [ 0, 0 ],
        density: 0,
        behaviour: 'fluid',
        generates: 'air',
        updatable: true,
        maxVelocity: 3,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    sand: {
        displayName: 'sand',
        hueRange: [ 25, 30 ],
        saturationRange: [ 50, 60 ],
        lightnessRange: [ 45, 50 ],
        alphaRange: [ 100, 100],
        density: 2,
        behaviour: 'dust',
        generates: 'air',
        updatable: true,
        maxVelocity: 2,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    sandGenerator: {
            displayName: 'sand generator',
        hueRange: [ 25, 30 ],
        saturationRange: [ 50, 60 ],
        lightnessRange: [ 35, 40 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'generator',
        generates: 'sand',
        updatable:true,
        maxVelocity:00,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    dirt: {
        displayName: 'dirt',
        hueRange: [ 20, 25 ],
        saturationRange: [ 40, 45 ],
        lightnessRange: [ 15, 19 ],
        alphaRange: [ 100, 100],
        density: 2.5,
        behaviour: 'dust',
        generates: 'air',
        updatable: true,
        maxVelocity: 2,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    water: {
        displayName: 'water',
        hueRange: [ 233, 235 ],
        saturationRange: [ 53, 55 ],
        lightnessRange: [ 50, 50 ],
        alphaRange: [ 100, 100],
        density: 1,
        behaviour: 'fluid',
        generates: 'air',
        updatable: true,
        maxVelocity: 3,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    waterGenerator: {
            displayName: 'water generator',
        hueRange: [ 233, 235 ],
        saturationRange: [ 53, 55 ],
        lightnessRange: [ 30, 32 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'generator',
        generates: 'water',
        updatable: true,
        maxVelocity: 0,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    smoke: {
        displayName: 'smoke',
        hueRange: [ 0, 0 ],
        saturationRange: [ 0, 0 ],
        lightnessRange: [ 75, 90 ],
        alphaRange: [ 100, 100],
        density: -0.5,
        behaviour: 'fluid',
        generates: 'air',
        updatable: true,
        maxVelocity: 3,
        flameblity: 0,
        maxAge: 100,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    oil: {
        displayName: 'oil',
        hueRange: [ 100, 100 ],
        saturationRange: [ 30, 32 ],
        lightnessRange: [ 6, 7 ],
        alphaRange: [ 100, 100],
        density: 8,
        behaviour: 'fluid',
        generates: 'air',
        updatable: true,
        maxVelocity: 3,
        flameblity: 2,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    oilGenerator: {
        displayName: 'oil generator',
        hueRange: [ 100, 100 ],
        saturationRange: [ 30, 32 ],
        lightnessRange: [ 3, 4 ],
        alphaRange: [ 100, 100],
        density: 1000,
        behaviour: 'generator',
        generates: 'oil',
        updatable: false,
        maxVelocity:00,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    stone: {
        displayName: 'stone',
        hueRange: [ 0, 0 ],
        saturationRange: [ 0, 0 ],
        lightnessRange: [ 30, 40 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'solid',
        generates: 'air',
        updatable: false,
        maxVelocity: 0,
        flameblity: 0.005,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    plastic: {
        displayName: 'plastic',
        hueRange: [ 0, 256 ],
        saturationRange: [ 30, 70 ],
        lightnessRange: [ 30, 40 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'solid',
        generates: 'air',
        updatable: false,
        maxVelocity: 2,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    wood: {
        displayName: 'wood',
        hueRange: [ 25, 30 ],
        saturationRange: [ 30, 35 ],
        lightnessRange: [ 10, 13 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'solid',
        generates: 'air',
        updatable: false,
        maxVelocity: 2,
        flameblity: 0.7,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    leaf: {
        displayName: 'leaf',
        hueRange: [ 130, 140 ],
        saturationRange: [ 40, 45 ],
        lightnessRange: [ 35, 40 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'solid',
        generates: 'air',
        updatable: false,
        maxVelocity: 2,
        flameblity: 0.7,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    fire: {
        displayName: 'fire',
        hueRange: [ 0, 20 ],
        saturationRange: [ 50, 60 ],
        lightnessRange: [ 40, 50 ],
        alphaRange: [ 100, 100],
        density: -1,
        behaviour: 'fluid',
        generates: 'air',
        updatable: true,
        maxVelocity: 2,
        flameblity: 0,
        maxAge: 10,
        diesTo: 'smoke',
        chanceToDieTo: 0.5,
    },
    fireGenerator: {
        displayName: 'fire generator',
        hueRange: [ 0, 15 ],
        saturationRange: [ 40, 45 ],
        lightnessRange: [ 35, 40 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'generator',
        generates: 'fire',
        updatable:true,
        maxVelocity: 0,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
    lava: {
        displayName: 'lava',
        hueRange: [ 0, 50 ],
        saturationRange: [ 53, 55 ],
        lightnessRange: [ 50, 50 ],
        alphaRange: [ 100, 100],
        density: 1,
        behaviour: 'fluid',
        generates: 'water',
        updatable: true,
        maxVelocity: 3,
        flameblity: 0,
        maxAge: 1000,
        diesTo: 'stone',
        chanceToDieTo: 1,
    },
    lavaGenerator: {
        displayName: 'lava generator',
        hueRange: [ 0, 50 ],
        saturationRange: [ 53, 55 ],
        lightnessRange: [ 30, 30 ],
        alphaRange: [ 100, 100],
        density: 100,
        behaviour: 'generator',
        generates: 'lava',
        updatable:true,
        maxVelocity: 0,
        flameblity: 0,
        maxAge: 0,
        diesTo: 'air',
        chanceToDieTo: 1,
    },
}
let typesList = []
for ( let i in types) typesList.push(i)

class Cell{
    constructor(type){
        this.type = type
        this.vx = 0
        this.vy = 0
        this.density = types[this.type].density
        this.behaviour = types[this.type].behaviour
        this.maxVelocity = types[this.type].maxVelocity
        this.flameblity = types[this.type].flameblity
        this.generates = types[this.type].generates
        this.style = `hsla(${random(types[this.type].hueRange[0],types[this.type].hueRange[1], 1)},${random(types[this.type].saturationRange[0],types[this.type].saturationRange[1], 1)}%,${random(types[this.type].lightnessRange[0],types[this.type].lightnessRange[1], 1)}%,${random(types[this.type].alphaRange[0],types[this.type].alphaRange[1], 1)}%)`
        this.updatable = types[this.type].updatable
        this.updated = false
        this.age = 0
        this.maxAge = types[this.type].maxAge
        this.diesTo = types[this.type].diesTo
        this.chanceToDieTo = types[this.type].chanceToDieTo
    }
}

let renderMap = (map)=>{
    for ( let y in map ){
        for ( let x in map[y] ){
            c.fillStyle = map[y][x].style
            c.fillRect( x*res ,y*res , res, res)
            c.fillStyle = 'black'
            //c.fillText( `${x}, ${y}`, x*res+res/3, y*res+res/2)
        }
    }
}

let updateMap = (map)=>{

    for( let y in map ){
        for( let x in map[y] ){
            map[y][x].updated = false
            map[y][x].age += 1
            if( map[y][x].age >= map[y][x].maxAge & map[y][x].maxAge != 0 ){
                if(rdm(map[y][x].chanceToDieTo)){
                    map[y][x] = new Cell(map[y][x].diesTo)
                } else {
                    map[y][x] = new Cell('air')
                }
            }
        }
    }

    let deltaMap = []  
    for ( let y in map ){
        deltaMap.push([])
        for ( let x in map[y] ){
            deltaMap[y].push(map[y][x])
        }
    }

    for ( let y = 0 ; y < map.length ; y++ ){       //determining the velocity based on the possision
        for ( let x = 0 ; x < map[0].length ; x++ ){
        switch (map[y][x].behaviour) {
            case 'dust':
                if( map[y][x].vy > 0 ){
                    if(map[y][x].vy < map[y][x].maxVelocity )  map[y][x].vy += -1
                } else if ( map[y][x].vy < 0 ){
                    if(map[y][x].vy < map[y][x].maxVelocity )  map[y][x].vy += -1
                }
                if( map[y][x].vx > 0 ){
                    if(map[y][x].vx < map[y][x].maxVelocity )  map[y][x].vx += -1
                } else if ( map[y][x].vx < 0 ){
                    if(map[y][x].vx < map[y][x].maxVelocity )  map[y][x].vx += 1
                }
                if(map[y+1] != undefined ){
                    if( map[y+1][x].density < map[y][x].density ){
                        if(map[y][x].vy < map[y][x].maxVelocity )  map[y][x].vy += 1
                    }
                     if( map[y+1][x+1] != undefined) {
                        if(map[y+1][x+1].density < map[y][x].density){
                            if(map[y][x].vy < map[y][x].maxVelocity )  map[y][x].vy += 1
                            if(map[y][x].vx < map[y][x].maxVelocity )  map[y][x].vx += 1
                        }
                    }
                    if( map[y+1][x-1] != undefined ){
                        if(map[y+1][x-1].density < map[y][x].density){
                            if(map[y][x].vy < map[y][x].maxVelocity )  map[y][x].vy += 1
                            if(map[y][x].vx < map[y][x].maxVelocity )  map[y][x].vx += -1
                        }
                    }
                } 
                break;
            case 'fluid':
                moved = false

                if( map[y][x].vy < -2 ) map[y][x].vy++
                if( map[y][x].vx < -2 ) map[y][x].vx++
                if( map[y][x].vy > +2 ) map[y][x].vy--
                if( map[y][x].vx > +2 ) map[y][x].vx--

                if(map[y+1] != undefined ){
                    if( map[y+1][x].density < map[y][x].density ){
                        map[y][x].vy = 1
                        moved = true
                    }
                    if( map[y+1][x+1] != undefined ){
                        if(map[y+1][x+1].density < map[y][x].density ){
                            if(map[y][x].vy < map[y][x].maxVelocity ) map[y][x].vy += 1
                            if(map[y][x].vx < map[y][x].maxVelocity ) map[y][x].vx += 1
                            moved = true
                        }
                    }
                    if( map[y+1][x-1] != undefined ){
                        if(map[y+1][x-1].density < map[y][x].density ){
                            if(map[y][x].vy < map[y][x].maxVelocity ) map[y][x].vy += 1
                            if(map[y][x].vx < map[y][x].maxVelocity ) map[y][x].vx += -1
                            moved = true
                        }
                    }
                }
                if( map[y][x+1] != undefined ){
                    if(map[y][x+1].density < map[y][x].density & !moved & rdm(1) ){
                        if(map[y][x].vx < map[y][x].maxVelocity ) map[y][x].vx += 1
                        moved = true
                    }
                }
                if( map[y][x-1] != undefined ){
                    if(map[y][x-1].density < map[y][x].density & !moved ){
                        if(map[y][x].vx < map[y][x].maxVelocity ) map[y][x].vx += -1
                        moved = true
                    }
                }                
                break;
            case 'generator':
                if( map[y][x+1] != undefined ){
                    if(map[y][x+1].behaviour != 'generator' ){
//                        if(deltaMap[y][x+1].type == 'air'){
                            deltaMap[y][x+1] = new Cell(map[y][x].generates)
                        }
//                    }
                }
                if( map[y][x-1] != undefined ){
                    if(map[y][x-1].behaviour != 'generator' ){
//                        if(deltaMap[y][x-1].type == 'air'){
                            deltaMap[y][x-1] = new Cell(map[y][x].generates)
                        }
//                    }
                }
                if( map[y+1] != undefined ){
                    if(map[y+1][x].behaviour != 'generator' ){
//                        if(deltaMap[y+1][x].type == 'air'){
                            deltaMap[y+1][x] = new Cell(map[y][x].generates)
                        }
//                    }
                }
                if( map[y-1] != undefined ){
                    if(map[y-1][x].behaviour != 'generator' ){
//                        if(deltaMap[y-1][x].type == 'air'){
                            deltaMap[y-1][x] = new Cell(map[y][x].generates)
                        }
//                    }
                }

                break
            default:
                break;
            }
            if ( map[y][x].type == 'fire' ){
                for( let fy = -1 ; fy <= 1 ; fy++){
                    if(map[y+fy] == undefined ) continue
                    for( let fx = -1 ; fx <= 1 ; fx++){
                        if( fy == 0 & fx == 0 ) continue
                        if(map[y+fy][x+fx] == undefined ) continue
                        if(rdm(map[y+fy][x+fx].flameblity) & rdm(5) ){
                            deltaMap[y+fy][x+fx] = new Cell('fire')
                        }
                    }
                }
            }
            if ( map[y][x].type == 'lava' ){
                for( let fy = -1 ; fy <= 1 ; fy++){
                    if(map[y+fy] == undefined ) continue
                    for( let fx = -1 ; fx <= 1 ; fx++){
                        if( fy == 0 & fx == 0 ) continue
                        if(map[y+fy][x+fx] == undefined ) continue
                        if(map[y+fy][x+fx].type == 'water'){
                            deltaMap[y][x] = new Cell('stone')
                        }
                    }
                }
            }
        }
    }
    

    for ( let y = 0 ; y < map.length ; y++ ){       //moving based on the velocity
        for ( let x = 0 ; x < map[0].length ; x++ ){
            if (!map[y][x].updatable) continue
            let moved = false
            let dy = map[y][x].vy
            dy += dy > 0 ? 1 : -1;

            while ( dy != 0 ) {
                dy += dy > 0 ? -1 : 1;
                let dx = map[y][x].vx
                dx += dx > 0 ? 1 : -1;
                if(moved) continue

                while ( dx != 0 ) {
                    dx += dx > 0 ? -1 : 1;

                    if( map[y+dy] == undefined ) continue
                    if(map[y+dy][x+dx] == undefined) continue
                    if( dy == 0 & dx == 0 ) continue
                    if(moved) continue
                    if(deltaMap[y][x].updated) continue
                    if(deltaMap[y+dy][x+dx].updated) continue
                    
                    if(map[y+dy][x+dx].density < map[y][x].density == true){
                        deltaMap[y][x] = map[y+dy][x+dx]
                        deltaMap[y+dy][x+dx] = map[y][x]
                        deltaMap[y][x].updated = true
                        deltaMap[y+dy][x+dx].updated = true
                        moved = true
                    }

                }
            }
        }
    }

    return deltaMap
}

let step = 0

function loop(){

//     --loop--

    setTimeout(() => {
        requestAnimationFrame(loop)
    }, 1000 / max_stepsPerSecond);
    step++

//   --updates--

    if ( !paused ) currentMap = updateMap(currentMap)
    mouse.style = `hsl(${average(types[material].hueRange)}, ${average(types[material].saturationRange)}%, ${average(types[material].lightnessRange)}%)`;
    if(mouse.z){
        for( let i = 0 ; i < mouse.size ; i++ ){
            for( let a = 0 ; a < mouse.size ; a++ ){
                if(currentMap[Math.floor(mouse.y/res)+i] == undefined ) continue
                if(currentMap[Math.floor(mouse.y/res)+i][Math.floor(mouse.x/res)+a] == undefined ) continue
                if( mouse.density == 0 ) currentMap[Math.floor(mouse.y/res)+i][Math.floor(mouse.x/res)+a] = new Cell(material)
                else if(rdm(1/mouse.density) == 0) currentMap[Math.floor(mouse.y/res)+i][Math.floor(mouse.x/res)+a] = new Cell(material)
            }
        }
    }

//   --rendering--

    c.clearRect( 0, 0, width, height)
    renderMap(currentMap)
    c.fillStyle = mouse.style;
    c.fillRect( Math.floor(mouse.x/res)*res, Math.floor(mouse.y/res)*res, mouse.size*res, mouse.size*res)
}

let world = []
for( let y = 0 ; y < Math.round(height/res) ; y++ ){
    world.push([])
    for( let x = 0 ; x < Math.round(width/res) ; x++ ){
        world[y][x] = new Cell('air')
        if(!rdm(4)) world[y][x] = new Cell('dirt')
        if(!rdm(8)) world[y][x] = new Cell('water')
        if(!rdm(20)) world[y][x] = new Cell('sand')
    }
}

let material = 'sand'
for( let i in types ){
    if(i=='air') continue
    $('materials').innerHTML += `<div class="selection" id="${i}-selector">${types[i].displayName}</div>`
    $(i+'-selector').style.background = `hsl(${average(types[i].hueRange)}, ${average(types[i].saturationRange)}%, ${average(types[i].lightnessRange)}%)`   
}
for( let i in types ){
    if(i=='air') continue
    $(i+'-selector').addEventListener('click', ()=>{
        material = i
    })
}


let currentMap = world;


$('pause').addEventListener( 'click', ()=>{
    pause()
})
$('play').addEventListener( 'click', ()=>{
    play()
})
$('clear').addEventListener( 'click', ()=>{
    let empty = []
    for( let y = 0 ; y < Math.round(height/res) ; y++ ){
        empty.push([])
        for( let x = 0 ; x < Math.round(width/res) ; x++ ){
            empty[y].push( new Cell('air'))
        }
    }
    currentMap = empty
})
$('randomize').addEventListener( 'click', ()=>{
    let random = []
    for( let y = 0 ; y < Math.round(height/res) ; y++ ){
        random.push([])
        for( let x = 0 ; x < Math.round(width/res) ; x++ ){
            random[y].push( new Cell(typesList[rdm(typesList.length-1)]))
        }
    }
    currentMap = random
})

$('brushSize').addEventListener( 'click', ()=>{
    mouse.size = prompt('brush size')
})
$('brushDensity').addEventListener( 'click', ()=>{
    mouse.density = prompt('brush density \n(0 for 100%)')
})
$('save').addEventListener( 'click', ()=>{
    let saveMap = []
    for ( let y in currentMap ){
        saveMap.push([])
        for ( let x in currentMap[y] ){
            saveMap[y].push(currentMap[y][x].type)
        }
    }
    localStorage.setItem( prompt('save to slot'), JSON.stringify(saveMap))
})
$('load').addEventListener( 'click', ()=>{
    let loadMap = eval(localStorage.getItem(prompt('load from slot', 1)))
    currentMap = []
    for ( let y in loadMap ){
        currentMap.push([])
        for ( let x in loadMap[y] ){
            currentMap[y].push( new Cell(loadMap[y][x]))
        }
    }
})



loop()


