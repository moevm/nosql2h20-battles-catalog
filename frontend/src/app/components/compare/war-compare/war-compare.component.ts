import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-war-compare',
  templateUrl: './war-compare.component.html',
  styleUrls: ['./war-compare.component.scss']
})
export class WarCompareComponent implements OnInit {
  wars = [
    {
      name: 'The seven year\'s war',
      battles: 49,
      duration: 7,
      armySizes: 240000,
      losses: 74593
    },
    {
      name: 'Netherlands war of independence',
      battles: 23,
      duration: 14,
      armySizes: 4242445,
      losses: 2754000
    },
    {
      name: 'Franco-spanish war',
      battles: 34,
      duration: 23,
      armySizes: 240322,
      losses: 59848
    },
    {
      name: 'Monmouth\'s rebellion',
      battles: 84,
      duration: 2,
      armySizes: 13002,
      losses: 8342
    },
    {
      name: 'Thirty year\'s war',
      battles: 11,
      duration: 30,
      armySizes: 2400000,
      losses: 1350290
    }
  ];

  chartsData: {[key: string]: EChartOption} = {
    battles: {},
    duration: {},
    armySizes: {},
    losses: {}
  };

  @ViewChild('chart') chartWrapper: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    const gridWidthPc = .8;
    const barWidthPc = .6;

    const fontSizePx = 12;
    const letterWidthPx = 7.5;
    const ellipsisWidthPx = 11;

    const warNameToColor = this.wars.reduce((map, war) => {
      map[war.name] = `hsl(${Math.random() * 360}, 100%, 75%)`;
      return map;
    }, {});

    for (const key of Object.keys(this.chartsData)) {
      this.chartsData[key] = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.wars.map(war => war.name),
          axisLabel: {
            formatter: warName => {
              const gridWidthPx = this.chartWrapper.nativeElement.offsetWidth * gridWidthPc;
              const barWidthPx = gridWidthPx / this.wars.length * .75 - ellipsisWidthPx; // * .85 to safety margin
              const lettersAmount = Math.floor(barWidthPx / letterWidthPx);
              return `${warName.slice(0, lettersAmount)}...`;
            },
            fontSize: fontSizePx,
            showMinLabel: true,
            showMaxLabel: true
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: fontSizePx
          }
        },
        title: {
          text: key[0].toUpperCase() + key.slice(1)
        },
        grid: {
          width: `${gridWidthPc * 100}%`,
          height: '70%',
          left: '15%'
        },
        series: [{
          data: this.wars.map(war => ({
            value: war[key],
            itemStyle: {
              color: warNameToColor[war.name]
            }
          })),
          type: 'bar',
          barWidth: barWidthPc * 100
        }]
      };
    }

    console.log(this.chartsData);
  }
}
