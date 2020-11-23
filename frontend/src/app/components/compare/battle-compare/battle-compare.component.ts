import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartOption } from 'echarts';
import { BattlesService } from '../../../battles/battles.service';
import { ArmySizesPipe } from '../../../wars/table/army-sizes.pipe';
import { ArmyLossesPipe } from '../../../wars/table/army-losses.pipe';

@Component({
  selector: 'app-battle-compare',
  templateUrl: './battle-compare.component.html',
  styleUrls: ['./battle-compare.component.scss']
})
export class BattleCompareComponent implements OnInit {
  chartsData: {[key: string]: EChartOption} = {
    duration: {},
    armySizes: {},
    losses: {}
  };

  @ViewChild('chart') chartWrapper: ElementRef<HTMLDivElement>;

  constructor(private battles: BattlesService, private sizes: ArmySizesPipe, private losses: ArmyLossesPipe) {}

  ngOnInit(): void {
    const gridWidthPc = .8;
    const barWidthPc = .6;

    const fontSizePx = 12;
    const letterWidthPx = 7.5;
    const ellipsisWidthPx = 11;

    const wars = this.battles.selection.selected.map(b => ({
      name: b.name,
      // @ts-ignore
      duration: (new Date(b.datetime_max) - new Date(b.datetime_min)) / 1000 / 60 / 60,
      armySizes: this.sizes.transform(b.actors),
      losses: this.losses.transform(b.actors)
    }));

    const warNameToColor = wars.reduce((map, war) => {
      map[war.name] = `hsl(${Math.random() * 360}, 100%, 40%)`;
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
          left: '15%',
          top: key === 'duration' ? '15%' : 60
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

    console.log(this.chartsData);
  }
}
