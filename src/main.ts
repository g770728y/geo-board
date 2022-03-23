import "./style.css";

const boardDom = document.getElementById("board")!;
const pointInput = document.getElementById(
  "point-input"
) as HTMLTextAreaElement;
const msgDom = document.getElementById("msg")!;
const pointsViewer = document.getElementById("points-viewer")!;

function main() {
  readyTestData();
  readyDrawPoints();
}

function readyDrawPoints() {
  clearStrongColor();

  const drawButton = document.getElementById(
    "draw-button"
  ) as HTMLButtonElement;
  drawButton.addEventListener("click", redraw);
  boardDom.addEventListener("click", (e) => {
    const maybePoint = e.target as HTMLElement;
    if (maybePoint.classList.contains("point")) {
      const xy = maybePoint.dataset.xy;
      const xy_viewer = [...(pointsViewer.children as any)].find((node) => {
        return (node as any)?.innerText.replace(/\s/g, "") === xy;
      }) as any;
      xy_viewer && (xy_viewer.style.color = "red");
    } else {
      clearStrongColor();
    }
  });

  pointsViewer.addEventListener("click", (e) => {
    const maybeDataItem = e.target as HTMLElement;
    if (maybeDataItem.classList.contains("data-item")) {
      const xy = maybeDataItem.innerText.replace(/\s/g, "");
      const xy_board = [...(boardDom.children as any)].find((node) => {
        return node.dataset.xy === xy;
      }) as any;
      xy_board && (xy_board.style.transform = "scale(3)");
    } else {
      clearStrongColor();
    }
  });
}

function redraw() {
  boardDom.innerHTML = "";
  pointsViewer.innerHTML = "";
  msgDom.innerHTML = "";

  const points_str = pointInput.value;
  const points = points_str.split(",").map((it) => parseFloat(it));

  if (!checkPoints(points)) {
    return;
  }

  const pointss: number[][] = [];
  for (let i = 0; i < points.length; i += 2) {
    pointss[i] = [points[i], points[i + 1]];
  }

  drawPoints(pointss);
}

function drawPoints(pointss: number[][]) {
  pointss.forEach((it) => {
    const row = it.join("  ,  ");
    const rowDiv = document.createElement("div");
    rowDiv.innerHTML = row;
    rowDiv.classList.add("data-item");
    pointsViewer.appendChild(rowDiv);

    drawPoint(it);
  });
}

function drawPoint(p: number[]) {
  const div = document.createElement("div");
  div.style.left = p[0] + "px";
  div.style.top = p[1] + "px";
  div.classList.add("point");
  div.setAttribute("data-xy", p.join(","));
  boardDom.appendChild(div);
}

function readyTestData() {
  const points = [100, 100, 300, 300, 500, 500].join(",");
  pointInput.value = points;
}

function setError(msg: string) {
  msgDom.innerHTML = msg;
}
function checkPoints(points: number[]) {
  if (points.length % 2 !== 0) {
    setError("points数量必须是偶数");
    return false;
  }
  return true;
}

main();
function clearStrongColor() {
  [...(pointsViewer.children as any)].forEach(
    (it) => (it.style.color = "#000")
  );
  [...(boardDom.children as any)].forEach(
    (it) => (it.style.transform = "scale(1)")
  );
}
