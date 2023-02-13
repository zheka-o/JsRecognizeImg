var scribble;
var canvas;
var context;

$(document).ready(function() {
    scribble = $('#digitCanvas').jqScribble({ 
        //width:20,
        //height:20,
        brushSize: 1
    }).data('jqScribble');
    canvas = $('#digitCanvas')[0];
    context = canvas.getContext('2d');
});

function clearImg() {
    scribble.clear();
    $('#result').text('ready');
};

function move(x_offset, y_offset){
    var data = context.getImageData(0, 0, 20, 20);
    scribble.clear();
    context.putImageData(data, x_offset, y_offset);
    processImage();
}

function up(){
    move(0, -1);
}

function down(){
    move(0, 1);
}

function left(){
    move(-1, 0);
}

function right(){
    move(1, 0);
}

function getImage20_20(){
    var data = context.getImageData(0, 0, 20, 20).data;
    var x = new Array(401);
    x[0]=1;
    for(var i=0; i<20; i++){
        for(var j=0; j<20; j++){
            x[i*20+j+1] = data[(j*20+i)*4] > 0 ? 0: 1;
        }
    }
    
    return x;
}

function getImage(){
    var canvas = $('#digitCanvas')[0];
    var context = canvas.getContext('2d');
    ////////// new /////////////////////////////////
    // var newImageData = context.getImageData(0, 0, 400, 400);
    // var x = new Array(401);
    // x[0]=1;
    // for(var i=0; i<20; i++){
    //     for(var j=0; j<20; j++){
    //         var start = (j*400+i)*4;
    //         var pixel = 0;
    //         for(var n=0; n<20; n++){
    //             for(var m=0; m<20; m++){
    //                 pixel += newImageData.data[start + n*400*4 + m*20*4];
    //             }
    //         }
    //         x[i*20+j+1] = pixel > 0 ? 0 : 1;
    //         //x[i*20+j+1] = newImageData.data[(j*20+i)*4] > 0 ? 0: 1;
    //     }
    // }
    // console.log(x.join(','));
    // return x;
    
    ////////////////////////////////////////////////

    var newImageData = context.getImageData(0, 0, 20, 20);
    
    
    // var imageData = context.getImageData(0, 0, 400, 400);
    // var newCanvas = $("<canvas>")
    //     .attr("width", imageData.width)
    //     .attr("height", imageData.height)[0];
    // var newContext = newCanvas.getContext('2d');

    // newCanvas.getContext("2d").putImageData(imageData, 0, 0);

    // newContext.scale(20/400, 20/400);
    // newContext.drawImage(canvas, 0, 0);
    // var newImageData = newContext.getImageData(0, 0, 20, 20);

    var x = new Array(401);

    //context.scale(10, 10);
    //context.drawImage(newCanvas, 0, 0);

    x[0]=1;
    for(var i=0; i<20; i++){
        for(var j=0; j<20; j++){
            // ind = (j*20+i)*4;
            // var r = newImageData.data[ind];
            // var g = newImageData.data[ind+1];
            // var b = newImageData.data[ind+2];
            // x[i*20+j+1] = 1 - (r+g+b)/3/255;

            x[i*20+j+1] = newImageData.data[(j*20+i)*4] > 0 ? 0: 1;
        }
    }
    
    //console.log(x.join(','));

    return x;
}

function recognizeNN(x){
    var z2 = new Array(26);
    z2[0]=1;
    for(var i = 0; i<25; i++) {
        var result = 0;
        for(j=0; j<401; j++) {
            result += x[j] * theta1[i][j];
        }
        z2[i+1] = sigmoid(result); 
    }
    //console.log(z2);
    var z3 = new Array(10);
    for(var i = 0; i<10; i++) {
        var result = 0;
        for(j=0; j<26; j++) {
            result += z2[j] * theta2[i][j];
        }
        z3[i] = sigmoid(result); 
    }
    //console.log(z3);

    var max = -10000, ind = 0, max2, ind2;

    for(i = 0; i<10; i++) {
        if(z3[i]>max){
            max2 = max;
            ind2 = ind;
            max = z3[i];
            ind = i+1;
        }
    }

    return [ind, max, ind2, max2];
}

function processImage() {

    var x = getImage20_20();
    //console.log(x.join(','));
    var res = recognizeNN(x);
    var num = getAnswer(res[0]);
    var prob = getProbability(res[1]);
    var num2 = getAnswer(res[2]);
    var prob2 = getProbability(res[3]);

    $('#result').text(num + ' (' + prob + '), ' + num2 + ' ('+prob2 + ')');
    //alert(num);
}

function getAnswer(num){
    return num==10 ? 0 : num;
}

function getProbability(prob){
    return prob.toFixed(3);
}

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}