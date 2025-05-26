// Face Mesh Texture Mapping
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh
// https://youtu.be/R5UZsIwPbJA

let video;
let faceMesh;
let faces = [];
let triangles;
let uvCoords;
let img;
let maskImg; // 新增面具圖變數

function preload() {
  // Initialize FaceMesh model with a maximum of one face
  faceMesh = ml5.faceMesh({ maxFaces: 1 });

  // Load the texture image that will be mapped onto the face mesh
  maskImg = loadImage("1.png"); // 載入面具圖
}

function mousePressed() {
  // Log detected face data to the console
  console.log(faces);
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(640, 480, WEBGL);
  video = createCapture(VIDEO);
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);

  // Retrieve face mesh triangles and UV coordinates
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function draw() {
  // Center the 3D space to align with the canvas
  translate(-width / 2, -height / 2);
  background(0);

  // Display the video feed
  image(video, 0, 0);

  if (faces.length > 0) {
    let face = faces[0];

    // 取得下巴輪廓點（0~16）與鼻尖（30）
    let chinPoints = face.keypoints.slice(0, 17);
    let noseTip = face.keypoints[30];

    // 計算下巴區域的包圍盒
    let minX = Math.min(...chinPoints.map(p => p.x));
    let maxX = Math.max(...chinPoints.map(p => p.x));
    let minY = Math.min(...chinPoints.map(p => p.y));
    let maxY = Math.max(...chinPoints.map(p => p.y));

    // 面具高度從鼻尖到下巴最下方
    let maskY = noseTip.y;
    let maskH = maxY - maskY;
    let maskW = maxX - minX;
    let maskX = minX;

    // 貼上面具圖
    image(maskImg, maskX, maskY, maskW, maskH);

    // // 若要顯示臉部偵測點，可取消註解
    // fill(255,0,0); noStroke();
    // for(let p of chinPoints) ellipse(p.x, p.y, 5, 5);
    // ellipse(noseTip.x, noseTip.y, 5, 5);
  }
}
