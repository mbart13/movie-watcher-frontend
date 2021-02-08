import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Genre } from 'src/app/movies/models/genre';
import { Movie } from 'src/app/movies/models/movie';
import { MovieService } from 'src/app/movies/services/movie.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, OnChanges {

  @Input()
  movies: Movie[];
  genres$: Observable<Genre[]>;
  noMoreMovies: boolean;

  constructor(public movieService: MovieService) { }

  ngOnChanges(): void {
    this.noMoreMovies = this.movieService.pageNumber === this.movieService.totalPages;
  }

  ngOnInit(): void {
    this.genres$ = this.movieService.getGenres$();
  }

  loadMore(): void {
    this.movieService.urlParams.pageNumber++;
    if (this.movieService.searchMode) {
      this.movieService.searchMovies(this.movieService.searchTerm);
    } else {
      this.movieService.getMovies();
    }
    console.log(this.movieService.urlParams);
  }

}