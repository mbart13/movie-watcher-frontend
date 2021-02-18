import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import { MovieService } from '../../services/movie.service';
import {UrlParameters} from '../../models/url-parameters';
import {FiltersService} from '../../services/filters.service';
import {Router} from '@angular/router';
import {Movie} from '../../models/movie';

@Component({
  selector: 'app-movie-search',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private searchTerm = new Subject<string>();
  value = '';
  @Input()
  searchValue;
  // movies$: Observable<Movie[]>;

  constructor(private movieService: MovieService, private filtersService: FiltersService, private router: Router) {}

  ngOnInit(): void {
    // this.value = this.movieService.searchTerm.getValue();
    // if (this.movieService.searchTerm.getValue()) {
    //   this.movieService.searchMovies(this.value);
    // }
    // this.movies$ = this.movieService.getMovies$();
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(async (searchTerm) => {
        this.movieService.searchMovies(searchTerm);
      })
        // this.searchValue.emit(this.searchTerm);
          // this.movieService.movies$.next([]);

        // this.searchValue.emit(searchTerm);


    ).subscribe();
  }

  search(term: string): void {
    if (term.length > 1) {

      this.router.navigate(['/search']);
      // this.filtersService.allFiltersHiddenEmitter.next(true);
      // this.movieService.searchTerm.next(term);
      // this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
      this.searchTerm.next(term);
      this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
      this.movieService.searchTerm.next(term);

    } else if (term.length === 0) {
      this.movieService.movies$.next([]);
      // this.filtersService.allFiltersHiddenEmitter.next(false);
      setTimeout(() => this.router.navigate(['/movies']), 700);
      // setTimeout(() => this.movieService.getMovies(), 700);
    }
  }

}