<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Deutsche Tastatur</title>
<style>
  body, html { height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; }
  .keyboard { 
    display: grid; 
    grid-template-columns: 1fr 2fr 1fr; 
    grid-template-rows: 1fr 2fr 1fr; 
    height: 100vh; 
    width: 100vw;
    gap: 10px; /* Abstand zwischen den Tasten */
  }
  .key {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
  }
  .top, .left, .right, .bottom { 
    grid-column: 2 / 3; 
  }
  .top { grid-row: 1 / 2; }
  .left { grid-column: 1 / 2; grid-row: 2 / 3; }
  .right { grid-column: 3 / 4; grid-row: 2 / 3; }
  .bottom { grid-row: 3 / 4; grid-column: 1 / 4; } /* Span across all columns */
  .td {
    padding: 10px 20px;
    border: none;
    color: #fff;
    background-color: #398de7;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s, transform 0.3s;
    font-size: 36px;
  }
  .td:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  .delp {
    width: 50px;
    padding: 10px;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
  #delp {
    background-color: #ff4d4d; /* Red color for the delete button */
    color: white;
  }
  #delp:hover {
    background-color: #ff0000;
  }
  .delt {
    width: 50px;
    padding: 10px;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
  #delt {
    background-color: #ff4d4d; /* Red color for the delete button */
    color: white;
  }
  #delt:hover {
    background-color: #ff0000;
  }
  .space {
    width: 50px;
    padding: 10px;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
  #space {
    background-color: #398de7; /* Red color for the delete button */
    color: white;
  }
  #space:hover {
    background-color: #0056b3;
  }
  .go {
    width: 70px;
    padding: 10px;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
  #go {
    background-color: #4ca80e; /* Red color for the delete button */
    color: white;
  }
  #go:hover {
    background-color: #3a6f0b;
  }
  .inpi {
    width: 250px;
    height: 50px;
    padding: 10px;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
</style>
<script>
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.td').forEach(function(item) {
    item.addEventListener('click', function() {
      var currentText = document.querySelector('.inpi').value;
      document.querySelector('.inpi').value = currentText + this.innerText;

      if (this.innerText.match(/[.!?]/) && document.querySelector('.inpi').value.length > 2) {
        document.querySelector('.inpi').value += ' ';
      }
    });
  });

  document.querySelector('#delp').addEventListener('click', function() {
    document.querySelector('.inpi').value = document.querySelector('.inpi').value.slice(0, -1);
  });

  document.querySelector('#delt').addEventListener('click', function() {
    let text = document.querySelector('.inpi').value;
    let parts = text.split(' ').filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      document.querySelector('.inpi').value = parts.join(' ') + ' ';
    } else {
      document.querySelector('.inpi').value = '';
    }
  });

  document.querySelector('#space').addEventListener('click', function() {
    document.querySelector('.inpi').value += ' ';
  });
});

document.getElementById('go').addEventListener('click', () => {
      const text = document.getElementById('text').value;
      window.electronAPI.performKeyPress(text);
    });

</script>



<script src="renderer.js"></script>



</head>
<body>
<div class="keyboard">
  <table class="key top">
    <tr><td class="td">a</td><td class="td">b</td><td class="td">c</td></tr>
    <tr><td class="td">d</td><td class="td">e</td><td class="td">f</td></tr>
    <tr><td class="td">g</td><td class="td">h</td><td class="td">i</td></tr>
  </table>
  <table class="key left">
    <tr><td class="td">j</td><td class="td">k</td><td class="td">l</td></tr>
    <tr><td class="td">m</td><td class="td">n</td><td class="td">o</td></tr>
    <tr><td class="td">p</td><td class="td">q</td><td class="td">r</td></tr>
  </table>
  <table class="key right">
    <tr><td class="td">s</td><td class="td">t</td><td class="td">u</td></tr>
    <tr><td class="td">v</td><td class="td">w</td><td class="td">x</td></tr>
    <tr><td class="td">y</td><td class="td">z</td><td class="td">ä</td></tr>
    <tr><td class="td">ö</td><td class="td">ü</td><td class="td">ß</td></tr>
  </table>
  <table class="key bottom">
    <tr>
      <td><button id="delt" class="delt">dt</button></td>
      <td><button id="delp" class="delp">dp</button></td>
      <td><button id="space"class="space">_</button></td>
      <td><input type="text" class="inpi" id="text" placeholder="Text eingeben"></td>
      <td><button id="go" class="go">Go</button></td>
    </tr>
  </table>
</div>
</body>
</html>
