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
  createCanvas(windowWidth, windowHeight, WEBGL);
  video = createCapture(VIDEO);
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);

  // Retrieve face mesh triangles and UV coordinates
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Center the 3D space to align with the canvas
  translate(-width / 2, -height / 2);
  background(255, 255, 200); // 淡黃色

  // Display the video feed
  image(video, 0, 0);

  if (faces.length > 0) {
    let face = faces[0];

    // 臉部偵測到的兩眼座標
    let leftEye = face.keypoints[36];
    let rightEye = face.keypoints[45];

    // 取得嘴巴中心點
    let mouth = face.keypoints[66];

    // 額頭中心點（keypoints[10]）
    let forehead = face.keypoints[10];

    // 計算縮放比例（可依需求調整倍率）
    let scaleRatio = (faceEyeDist / maskEyeDist) * 6;

    // 計算面具縮放後的寬高
    let maskW = maskImg.width * scaleRatio;
    let maskH = maskImg.height * scaleRatio;

    // 讓面具中心對齊額頭中心點
    let maskX = forehead.x - maskW / 2;
    let maskY = forehead.y - maskH / 2;

    // 貼上面具圖
    image(maskImg, maskX, maskY, maskW, maskH);

    // // 若要顯示偵測點，可取消註解
    // fill(255,0,0); noStroke();
    // ellipse(leftEye.x, leftEye.y, 5, 5);
    // ellipse(rightEye.x, rightEye.y, 5, 5);
  }
}

