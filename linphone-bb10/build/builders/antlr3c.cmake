############################################################################
# antlr3c.cmake
# Copyright (C) 2014  Belledonne Communications, Grenoble France
#
############################################################################
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
############################################################################

set(EP_antlr3c_GIT_REPOSITORY "git://git.linphone.org/antlr3.git")
if(${LINPHONE_TARGET_LINPHONE})
	set(EP_antlr3c_GIT_TAG "linphone")
else()
	set(EP_antlr3c_GIT_TAG "c2a2df0abc72e0611dd068c93731b3561b7c713c")
endif()
set(EP_antlr3c_CMAKE_OPTIONS "-DENABLE_DEBUGGER=0")
set(EP_antlr3c_LINKING_TYPE "-DENABLE_STATIC=0")
if(MSVC)
	set(EP_antlr3c_EXTRA_LDFLAGS "/SAFESEH:NO")
endif(MSVC)
