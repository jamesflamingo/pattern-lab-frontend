import classicDress from '../images/45e9085b-bcaf-4f3a-ae4c-8c28deba562a.png'
import modernDress from '../images/9401d9ef-082f-464b-b45a-49f69ecabff6.png'

import bishopLeft from '../assets/dresses/classic-wrap/sleeves/bishop-left.png'
import bishopRight from '../assets/dresses/classic-wrap/sleeves/bishop-right.png'
import flutterLeft from '../assets/dresses/classic-wrap/sleeves/flutter-left.png'
import flutterRight from '../assets/dresses/classic-wrap/sleeves/flutter-right.png'

import squareNeckline from '../assets/dresses/classic-wrap/necklines/square.png'
import wrapVNeckline from '../assets/dresses/classic-wrap/necklines/wrap-v.png'

import belt from '../assets/dresses/classic-wrap/overlays/belt.png'
import cascadeHem from '../assets/dresses/classic-wrap/hems/cascade.png'
import tulipHem from '../assets/dresses/classic-wrap/hems/wrap-tulip.png'

// Todas las coordenadas están en píxeles del vestido base (width x height).
//
// Cada capa sustituye una zona del vestido:
// - `componentId`: componente del editor cuya opción elegida decide la pieza.
// - `hide`: polígono del vestido base que se oculta cuando hay pieza elegida.
// - `pieces[opción]`: imagen y rectángulo (x, y, width, height) donde se coloca.
//   `clip` (opcional) polígono fuera del cual no se dibujan las piezas de la capa.
// - `overlay` (opcional): imagen que se dibuja encima de la pieza elegida.
export const dressConfigs = {
  1: {
    name: 'Classic Dress',
    base: classicDress,
    width: 1024,
    height: 1536,
    layers: [
      {
        slot: 'sleeve-left',
        componentId: '3',
        alt: 'Left sleeve variation',
        hide: '120,60 300,60 303,93 312,140 326,200 332,260 336,330 344,372 350,386 120,386',
        pieces: {
          Bishop: { src: bishopLeft, x: 124.4, y: 82.1, width: 233.2, height: 444.7 },
          Bell: { src: flutterLeft, x: 136, y: 84, width: 247.2, height: 303.1 },
        },
      },
      {
        slot: 'sleeve-right',
        componentId: '7',
        alt: 'Right sleeve variation',
        hide: '724,60 900,60 900,386 668,386 674,378 680,350 692,290 698,200 712,130 722,93',
        pieces: {
          Bishop: { src: bishopRight, x: 664.3, y: 82.1, width: 233.4, height: 444.8 },
          Bell: { src: flutterRight, x: 639.8, y: 84, width: 247.2, height: 304 },
        },
      },
      {
        slot: 'neckline',
        componentId: '2',
        alt: 'Neckline variation',
        hide: '304,40 724,40 722,93 712,130 698,200 692,290 680,350 674,378 666,400 645,476 376,476 352,385 344,372 336,330 332,260 326,200 312,140 302,96',
        pieces: {
          Square: { src: squareNeckline, x: 293.7, y: 56.6, width: 435.5, height: 438.2 },
          'V-neck': { src: wrapVNeckline, x: 293.6, y: 55.2, width: 434.6, height: 439.6 },
        },
      },
      {
        slot: 'hem',
        componentId: '40',
        alt: 'Hem variation',
        // La falda se sustituye entera desde justo debajo del cinturón; a la derecha
        // del torso también se oculta el lazo original, que se redibuja en `drawings`.
        hide: [
          '0,535 652,535 652,470 1024,470 1024,1536 0,1536',
          // Extremo izquierdo del cinturón original: lo sustituye `overlay`.
          '340,478 373,478 373,536 340,536',
        ],
        // Zona donde se dibuja la falda: empieza en el borde inferior del cinturón y, a la derecha
        // del nudo, solo desde debajo de las lazadas.
        clip: '0,531 396,531 396,506 656,506 656,570 1024,570 1024,1536 0,1536',
        overlay: { src: belt, x: 372, y: 481, width: 250, height: 59 },
        // Lazo dibujado en vectores con el mismo trazo y tono que la ilustración.
        drawings: [
          {
            d: 'M642 530 L668 532 C678 610 686 700 684 836 L662 858 L646 838 L636 852 C630 730 636 630 642 530 Z',
            shade: 'M656 548 C664 650 666 740 660 838',
          },
          {
            d: 'M660 528 L682 524 C704 610 726 690 738 778 L716 800 L702 778 L690 792 C680 700 668 620 660 528 Z',
            shade: 'M674 548 C692 630 710 700 720 780',
          },
          {
            d: 'M660 522 C690 540 738 554 760 580 C774 598 762 622 738 620 C706 616 672 580 656 542 Z',
            shade: 'M668 538 C700 556 732 580 746 606',
          },
          {
            d: 'M660 500 C692 478 748 482 770 504 C782 520 768 542 744 546 C712 550 682 536 658 520 Z',
            shade: 'M666 506 C702 498 742 508 756 526',
          },
          {
            d: 'M622 494 C634 486 650 486 662 494 C666 510 664 526 656 534 C642 538 628 534 622 526 C618 514 618 502 622 494 Z',
            shade: 'M634 498 C642 508 644 520 640 530',
          },
        ],
        pieces: {
          Ruffled: { src: cascadeHem, x: 91.8, y: 474.7, width: 820.8, height: 1034.6 },
          Asymmetric: { src: tulipHem, x: 181.8, y: 474, width: 649, height: 1050 },
        },
      },
    ],
  },
  // Preparado: añadir aquí las capas cuando existan piezas para el moderno.
  2: {
    name: 'Modern Dress',
    base: modernDress,
    width: 1024,
    height: 1536,
    layers: [],
  },
}

// Opciones con pieza para un componente; null si el componente no tiene capa.
export function getAvailableOptions(garmentId, componentId) {
  const layer = dressConfigs[garmentId]?.layers.find(
    (item) => String(item.componentId) === String(componentId)
  )
  return layer ? Object.keys(layer.pieces) : null
}
