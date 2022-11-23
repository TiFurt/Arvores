import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TreeAlgorithm } from 'src/app/models/tree-algorithm.model';

@Component({
  selector: 'app-card-algorithms',
  templateUrl: './card-algorithms.component.html',
  styleUrls: ['./card-algorithms.component.scss']
})
export class CardAlgorithmsComponent implements OnInit {
  @Input() algorithm: TreeAlgorithm = {} as TreeAlgorithm;

  public innerAlgorithmButton: string = "Ver algoritmo";

  public algorithmButtonClicked: boolean = false;


  constructor( private sanitizer: DomSanitizer) {

   }

  ngOnInit(): void {
    this.algorithm.videoSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.algorithm.video);
  }


  public openAlgorithm(): void {
    this.innerAlgorithmButton = this.innerAlgorithmButton === "Ver algoritmo" ? "Ocultar algoritmo" : "Ver algoritmo";
    this.algorithmButtonClicked = !this.algorithmButtonClicked;
  }



}
