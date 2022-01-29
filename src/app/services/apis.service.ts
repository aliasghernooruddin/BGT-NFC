import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})


export class ApisService {
  parameters: {};
  constructor(public http: HttpClient, public auth: AuthenticationService) { }
  reqOpts = {
    headers: {},
    withCredentials: true
  }
  BASE_URL = 'http://ec2-3-35-42-152.ap-northeast-2.compute.amazonaws.com:8000/api/v1/';

  loginUser(data) {
    let url = this.BASE_URL + "login/"
    return new Promise(resolve => {
      this.http.post(url, data, {headers: {}}).subscribe(data => {
        if(!!data['data']) {
          this.auth.setCsrf(data["data"].id.toString())
        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getAdminEvents() {
    let url = this.BASE_URL + "get_events/"
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          console.log(val)
          this.http.get(url, this.reqOpts).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
     
  }

  getJudgeEvents(id) {
    let url = this.BASE_URL + "get_judge_events/"+id
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          this.http.get(url,  this.reqOpts).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
     
  }


  postAdminEvent(data) {
    let url = this.BASE_URL + "upsert_event/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  postEnrolUser(data) {
    let url = this.BASE_URL + "enroll_user/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  patchEnrolUser(data) {
    let url = this.BASE_URL + "enroll_user/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }


  patchAdminEvent(data) {
    let url = this.BASE_URL + "upsert_event/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  markScore(data, id) {
    let url = this.BASE_URL + "mark_score/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  postEventCategory(data) {
    let url = this.BASE_URL + "upsert_event_category/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  patchEventCategory(data) {
    let url = this.BASE_URL + "upsert_event_category/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  postEventCompetition(data) {
    let url = this.BASE_URL + "event_competition/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  addJudge(data) {
    let url = this.BASE_URL + "event_judges/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  

  patchEventCompetition(data) {
    let url = this.BASE_URL + "event_competition/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  getCurrentSlot(data) {
    let url = this.BASE_URL + "get_current_slot/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        let obj = this.reqOpts
        obj["params"] = data
        this.http.get(url, obj).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  getUserEnrolments(eventId) {
    let url = this.BASE_URL + "get_user_enrollments/"+eventId
      return new Promise(resolve => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.auth.getCsrf().then((val) => {
          this.reqOpts.headers["USERID"] = val
          this.http.get(url,  this.reqOpts).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }

  getEventCategories(catId) {
    let url = this.BASE_URL + "get_event_categories/"+catId
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          this.http.get(url,  this.reqOpts).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }

  getEventCompetitions(data) {
    let url = this.BASE_URL + "event_competition/"
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          let obj = this.reqOpts
          obj["params"] = data
          this.http.get(url, obj).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }
  
  getJudges(data) {
    let url = this.BASE_URL + "event_judges/"
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          let obj = this.reqOpts
          obj["params"] = data
          this.http.get(url, obj).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }

  getEventsScores(data) {
    let url = this.BASE_URL + "get_events_scores_users/"
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          let obj = this.reqOpts
          obj["params"] = data
          this.http.get(url, obj).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }
  

  getEventParticipants(data) {
    let url = this.BASE_URL + "event_participants/"
      return new Promise(resolve => {
        this.auth.getCsrf().then((val) => {
          this.reqOpts = {
            headers: {},
            withCredentials: true
          }
          this.reqOpts.headers["USERID"] = val
          let obj = this.reqOpts
          obj["params"] = data
          this.http.get(url, obj).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      })
  }

  postEventParticipants(data) {
    let url = this.BASE_URL + "event_participants/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.post(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  updateEventParticipants(data) {
    let url = this.BASE_URL + "event_participants/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }
  
  updateEventJudge(data) {
    let url = this.BASE_URL + "event_judges/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  markUserArrived(data) {
    let url = this.BASE_URL + "event_judges/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  updateRanks(data) {
    let url = this.BASE_URL + "update_ranks/"
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.patch(url, data, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  deleteEnrollment(id) {
    let url = this.BASE_URL + "delete_enrollment/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.delete(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  deleteEventCompetition(id) {
    let url = this.BASE_URL + "delete_event_competition/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.delete(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  deleteEvent(id) {
    let url = this.BASE_URL + "delete_event/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.delete(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  deleteEventCategory(id) {
    let url = this.BASE_URL + "delete_event_category/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.delete(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }

  deleteEventJudge(id) {
    let url = this.BASE_URL + "get_judge_events/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.delete(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }
  
  getLeaderboard(id) {
    let url = this.BASE_URL + "get_leaderboard/"+id
    return new Promise(resolve => {
      this.auth.getCsrf().then((val) => {
        this.reqOpts = {
          headers: {},
          withCredentials: true
        }
        this.reqOpts.headers["USERID"] = val
        this.http.get(url, this.reqOpts).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    });
  }


  postSignup(data) {
    let url = this.BASE_URL + "signup/"
    return new Promise(resolve => {
      this.http.post(url, data, this.reqOpts).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  

}