import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
    faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
    faSquare, faCheckSquare, faEllipsis, faList, faListOl
} from '@fortawesome/free-solid-svg-icons'


export function setupFA(app) {
    library.add(
        faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
        faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
        faSquare, faCheckSquare, faEllipsis, faList, faListOl
    );

    app.component('font-awesome-icon', FontAwesomeIcon);
}