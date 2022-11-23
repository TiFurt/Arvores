import { Component, OnInit } from '@angular/core';
import { TreeAlgorithm } from 'src/app/models/tree-algorithm.model';
import { TREE_ALGORITHMS } from 'src/app/models/tree-algorithms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public treeAlgorithms: TreeAlgorithm[] = TREE_ALGORITHMS;

}
