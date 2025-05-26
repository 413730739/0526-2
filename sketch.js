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

    // 取得左眼外側(36)與右眼外側(45)的座標
    let leftEye = face.keypoints[36];
    let rightEye = face.keypoints[45];
    let nose = face.keypoints[30];

    // 眼罩寬度：兩眼外側距離的1.6倍（可依實際面具調整）
    let eyeDist = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
    let maskW = eyeDist * 1.6;
    // 眼罩高度：眼距的0.7倍（可依實際面具調整）
    let maskH = eyeDist * 0.7;

    // 眼罩中心點：兩眼中點稍微往下（可依面具圖微調）
    let maskX = (leftEye.x + rightEye.x) / 2 - maskW / 2;
    let maskY = (leftEye.y + rightEye.y) / 2 - maskH / 2 + eyeDist * 0.1;

    // 貼上面具圖
    image(maskImg, maskX, maskY, maskW, maskH);

    // // 若要顯示偵測點，可取消註解
    // fill(255,0,0); noStroke();
    // ellipse(leftEye.x, leftEye.y, 5, 5);
    // ellipse(rightEye.x, rightEye.y, 5, 5);
    // ellipse(nose.x, nose.y, 5, 5);
  }
}
