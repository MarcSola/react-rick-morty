/* eslint-disable no-console */
import React, { Component } from "react";
import { getEpisodes } from "../../api";
import Layout from "../../components/Layout";
import EpisodeCard from "../../components/EpisodeCard";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      paginationInfo: null,
      episodes: [],
      hasLoaded: false,
      hasError: false,
      errorMessage: null,
    };
    this.loadEpisodes = this.loadEpisodes.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  async componentDidMount() {
    const { page } = this.state;
    this.loadEpisodes(page);
  }

  async componentDidUpdate(_prevProps, prevState) {
    // destructuring page property from state and changing its name to prevPage
    const { page: prevPage } = prevState;
    const { page } = this.state;
    // console.log({ page });
    // console.log({ prevPage });

    if (page !== prevPage) {
      this.loadEpisodes(page);
    }
  }

  async loadEpisodes(page) {
    try {
      const { data } = await getEpisodes(page);
      this.setState((prevState) => {
        return {
          paginationInfo: data.info,
          episodes: [...prevState.episodes, ...data.results],
          hasLoaded: true,
        };
      });
      console.log(data);
    } catch (error) {
      this.setState({
        hasLoaded: true,
        hasError: true,
        errorMessage: error.message,
      });
    }
  }

  loadNextPage() {
    this.setState((prevState) => {
      return { page: prevState.page + 1 };
    });
  }

  render() {
    const {
      page,
      paginationInfo,
      episodes,
      hasLoaded,
      hasError,
      errorMessage,
    } = this.state;
    return (
      <Layout>
        <section className="row">
          {hasLoaded && !hasError && (
            <div className="col col-12">
              <h1>Episodes loaded!</h1>
            </div>
          )}
          {!hasLoaded && (
            <div className="col col-12">
              <h1>Loading episodes...</h1>
            </div>
          )}
          {hasError && (
            <div className="col col-12">
              <h1>Unable to load episodes. Something went wrong!</h1>
              <p>{errorMessage}</p>
            </div>
          )}
          <div className="col col-12">
            <hr />
          </div>
          {episodes.length > 0 &&
            episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                id={episode.id}
                name={episode.name}
                airDate={episode.air_date}
                episode={episode.episode}
              />
            ))}
          <div className="col col-12">
            <hr />
          </div>
          <div className="col col-12">
            <button
              className="btn btn-primary"
              type="button"
              disabled={paginationInfo && !paginationInfo.next}
              onClick={this.loadNextPage}
            >
              Next page
            </button>
          </div>
        </section>
      </Layout>
    );
  }
}

export default Home;
