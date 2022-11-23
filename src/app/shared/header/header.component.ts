import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TreeAlgorithm } from 'src/app/models/tree-algorithm.model';
import { TREE_ALGORITHMS } from 'src/app/models/tree-algorithms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public treeAlgorithm: TreeAlgorithm[] = TREE_ALGORITHMS;
  elms: any = document.getElementsByClassName('tree-algorithm');
  public detectedElm?: any;


  detectElms() {

    for (let i = 0; i < this.elms.length; i++) {
      const elm = this.elms[i];
      if (this.isInViewport(elm)) {
        this.detectedElm = elm.id;
        break;
      }
    }
  }

  constructor(private scroller: ViewportScroller) {
    document.addEventListener('scroll', this.detectElms.bind(this));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit () {

  }

  public Scroll(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  isInViewport (elm: any) {
    var elementTop = elm.offsetTop;
    var elementBottom = elementTop + elm.offsetHeight;

    // in this specific case the scroller is document.documentElement (<html></html> node)
    var viewportTop = document.documentElement.scrollTop;
    var viewportBottom = viewportTop + document.documentElement.clientHeight;
    console.log(`Topo elemento = ${elementTop}\n Fim elemento = ${elementBottom}\n Topo viewport = ${viewportTop}\n Fim viewport = ${viewportBottom}`);

    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

}
