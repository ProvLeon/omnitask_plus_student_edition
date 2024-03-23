# This file must be used with "source bin/activate.zsh" *from zsh*
# you cannot run it directly

deactivate () {
    # reset old environment variables
    if [[ -n "${_OLD_VIRTUAL_PATH:-}" ]] ; then
        PATH="${_OLD_VIRTUAL_PATH:-}"
        export PATH
        unset _OLD_VIRTUAL_PATH
    fi
    if [[ -n "${_OLD_VIRTUAL_PYTHONHOME:-}" ]] ; then
        PYTHONHOME="${_OLD_VIRTUAL_PYTHONHOME:-}"
        export PYTHONHOME
        unset _OLD_VIRTUAL_PYTHONHOME
    fi

    # Call rehash to forget past commands. Without forgetting
    # past commands the $PATH changes we made may not be respected
    rehash 2> /dev/null

    if [[ -n "${_OLD_VIRTUAL_PS1:-}" ]] ; then
        PS1="${_OLD_VIRTUAL_PS1:-}"
        export PS1
        unset _OLD_VIRTUAL_PS1
    fi

    unset VIRTUAL_ENV
    unset VIRTUAL_ENV_PROMPT
    if [[ ! "${1:-}" = "nondestructive" ]] ; then
    # Self destruct!
        unset -f deactivate
    fi
}

# unset irrelevant variables
deactivate nondestructive

VIRTUAL_ENV="/Users/okantah/Projects/omnitask_plus_student_edition/omnitask_plus_backend"
export VIRTUAL_ENV

_OLD_VIRTUAL_PATH="$PATH"
PATH="$VIRTUAL_ENV/bin:$PATH"
export PATH

# unset PYTHONHOME if set
# this will fail if PYTHONHOME is set to the empty string (which is bad anyway)
# could use `if [[ -u; : $PYTHONHOME ]] ;` in zsh
if [[ -n "${PYTHONHOME:-}" ]] ; then
    _OLD_VIRTUAL_PYTHONHOME="${PYTHONHOME:-}"
    unset PYTHONHOME
fi

if [[ -z "${VIRTUAL_ENV_DISABLE_PROMPT:-}" ]] ; then
    _OLD_VIRTUAL_PS1="${PS1:-}"
    PS1="(omnitask_plus_backend) ${PS1:-}"
    export PS1
    VIRTUAL_ENV_PROMPT="(omnitask_plus_backend) "
    export VIRTUAL_ENV_PROMPT
fi

# Call rehash to forget past commands. Without forgetting
# past commands the $PATH changes we made may not be respected
rehash 2> /dev/null
