import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartOption } from 'echarts';
import { WarsService } from '../../../wars/wars.service';
import { ArmySizesPipe } from '../../../wars/table/army-sizes.pipe';
import { ArmyLossesPipe } from '../../../wars/table/army-losses.pipe';

@Component({
  selector: 'app-war-compare',
  templateUrl: './war-compare.component.html',
  styleUrls: ['./war-compare.component.scss']
})
export class WarCompareComponent implements OnInit {
  chartsData: {[key: string]: EChartOption} = {
    battles: {},
    duration: {},
    armySizes: {},
    losses: {}
  };

  @ViewChild('chart') chartWrapper: ElementRef<HTMLDivElement>;

  constructor(private wars: WarsService, private sizes: ArmySizesPipe, private losses: ArmyLossesPipe) {}

  ngOnInit(): void {
    const gridWidthPc = .8;
    const barWidthPc = .6;

    const fontSizePx = 12;
    const letterWidthPx = 7.5;
    const ellipsisWidthPx = 11;

    const wars = this.wars.selection.selected
      .map(war => ({
        name: war.name,
        battles: war.battles_num,
        duration: new Date(war.datetime_max).getFullYear() - new Date(war.datetime_min).getFullYear(),
        armySizes: this.sizes.transform(war.actors),
        losses: this.losses.transform(war.actors)
      }));

    const warNameToColor = wars.reduce((map, war) => {
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
          data: wars.map(war => war.name),
          axisLabel: {
            formatter: warName => {
              const gridWidthPx = this.chartWrapper.nativeElement.offsetWidth * gridWidthPc;
              const barWidthPx = gridWidthPx / wars.length * .75 - ellipsisWidthPx; // * .85 to safety margin
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
          data: wars.map(war => ({
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
  }
}
